import os 
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue, MatchAny, PayloadSchemaType
import json
import re

load_dotenv()

groq_model = "openai/gpt-oss-120b"

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = QdrantClient(
    url = QDRANT_URL,
    api_key= QDRANT_API_KEY
)



TRANSCRIPTS_DIR = Path("transcripts")


def load_transcripts():
    transcripts = []

    transcript_files = list(TRANSCRIPTS_DIR.glob("*.json"))

    print(f"Found {len(transcript_files)} transcript files.")

    for file_path in transcript_files:
        with open(file_path, "r", encoding="utf-8") as file:
            transcript = json.load(file)

        transcripts.append(transcript)

    return transcripts


def create_chunks(transcripts, chunk_duration=75, overlap=15):
    chunks = []

    for transcript in transcripts:
        video_id = transcript["video_id"]
        title = transcript["title"]
        segments = transcript["segments"]

        if not segments:
            continue

        start_index = 0

        while start_index < len(segments):

            chunk_start = segments[start_index]["start"]
            chunk_segments = []

            for i in range(start_index, len(segments)):

                segment = segments[i]
                chunk_segments.append(segment)

                chunk_end = segment["end"]

                if chunk_end - chunk_start >= chunk_duration:
                    break

            chunk_text = " ".join(
                segment["text"].strip()
                for segment in chunk_segments
            )

            chunks.append({
                "video_id": video_id,
                "title": title,
                "start": chunk_start,
                "end": chunk_end,
                "text": chunk_text
            })

            # We want the next chunk to begin
            # approximately 15 seconds before this chunk ends.
            overlap_start = chunk_end - overlap

            next_start_index = start_index + 1

            # Keep the first segment that still overlaps
            # with our desired overlap region.
            while (
                next_start_index < len(segments)
                and segments[next_start_index]["end"] <= overlap_start
            ):
                next_start_index += 1

            start_index = next_start_index

    return chunks

COLLECTION_NAME = "rag_project_transcripts"
EMBEDDING_SIZE = 384

def create_collection():
    client.create_collection(collection_name=COLLECTION_NAME,vectors_config=  VectorParams(size=EMBEDDING_SIZE,distance=Distance.COSINE))
    print(f"Collection : '{COLLECTION_NAME}' created successfully")

model = None

def get_model():
    global model

    if model is None:
        model = SentenceTransformer("all-MiniLM-L6-v2")

    return model

def upload_chunks(chunks):
    batch_size = 64

    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i+batch_size]

        texts = [chunk["text"] for chunk in batch]

        embeddings = get_model().encode(texts)

        points = []

        for j,(chunk,embedding) in enumerate(zip(batch,embeddings)):
            points.append(
                PointStruct(
                    id = i+j,
                    vector = embedding.tolist(),
                    payload = {
                        "video_id": chunk["video_id"],
                        "title": chunk["title"],
                        "start": chunk["start"],
                        "end": chunk["end"],
                        "text":chunk["text"]
                    

                    }
                )
            )
        client.upsert(
            collection_name=COLLECTION_NAME,
            points=points
        )

        # print(f"Successfully uploaded {len(chunks)} chunks to Qdrant.")








def search(query, top_k=5):

    # Step 1: Semantic search
    candidate_count = 10

    query_vector = get_model().encode(query).tolist()

    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=candidate_count,
        with_payload=True
    ).points

    # Step 2: Remove common words from query
    stop_words = {
        "what", "where", "when", "how", "why",
        "is", "are", "was", "were", "the", "a",
        "an", "in", "on", "to", "for", "of",
        "and", "or", "do", "does",
        "hai", "hain", "hua", "hu",
        "ka", "ke", "ki", "kaha", "kahan",
        "mein", "me", "se",
        "solve", "kiya", "gaya",
        "question", "questions"
    }

    query_words = [
        word.lower()
        for word in re.findall(r"\b\w+\b", query)
        if word.lower() not in stop_words
        and len(word) >= 3
    ]

    # Step 3: Keep candidates that actually
    # contain at least one important query word
    keyword_results = []

    for result in results:

        text = result.payload["text"].lower()
        title = result.payload["title"].lower()

        text_words = set(
            re.findall(r"\b\w+\b", text)
        )

        title_words = set(
            re.findall(r"\b\w+\b", title)
        )

        matches = 0

        for word in query_words:
            if word in text_words or word in title_words:
                matches += 1

        if matches > 0:

            score = result.score

            # Give keyword matches a small boost
            score += matches * 0.10

            keyword_results.append(
                (score, result)
            )

    # Step 4: If keyword filtering found results,
    # use those results.
    #
    # Otherwise fall back to semantic search.
    if keyword_results:

        keyword_results.sort(
            key=lambda x: x[0],
            reverse=True
        )

        final_results = [
            result
            for score, result in keyword_results[:top_k]
        ]

    else:

        final_results = results[:top_k]

    return final_results


def get_video_sources(results):

    sources = []

    for result in results:

        payload = result.payload

        video_id = payload["video_id"]
        title = payload["title"]
        start = payload["start"]
        end = payload["end"]

        youtube_url = (
            f"https://www.youtube.com/watch?v={video_id}"
            f"&t={int(start)}s"
        )

        sources.append({
            "video_id": video_id,
            "title": title,
            "start": start,
            "end": end,
            "url": youtube_url,
            "score": result.score
        })

    return sources

groq_client = Groq(api_key=GROQ_API_KEY)

def ask_llm(question,context):
    prompt = f"""
You are a teaching assistant for DSA lectures.

Answer the user's question using ONLY the information provided in the lecture transcripts below.

Teach the topic asked in the question instead of giving only a one-line answer.
Explain the concept clearly and simply so that a student can understand and revise it.

Keep the answer concise:
- Focus only on the important points needed to understand the topic.
- Avoid unnecessary details or repetition.
- Prefer 3-5 short sections or bullet points when appropriate.
- Do not give a very long explanation unless the question requires it.

Language:
- If the user asks in Hinglish, explain in Hinglish.
- If the user asks in English, explain in English.
- Keep technical terms such as HashMap, sliding window, array, string, etc. in English.

Use ONLY information present in the provided lecture context.
Do not add concepts or facts from your own knowledge.

If the provided context does not contain enough information to explain the topic, say:
"I don't know based on the provided lecture content."

Context:
{context}

Question:
{question}
"""


    message = {
        "role":"user",
        "content":prompt
    }
    messages = [message]
    response = groq_client.chat.completions.create(model=groq_model,messages=messages)
    return response.choices[0].message.content


def answer_question(query):
    results = search(query)

    sources = get_video_sources(results)

    context = "\n\n".join(
        result.payload["text"]
        for result in results
    )

    answer = ask_llm(query, context)

    return answer, sources




def main():

    query = "What is a Hashmap?"

    answer, sources = answer_question(query)

    print("\nAnswer:\n")
    print(answer)

    print("\nVideo Sources:\n")

    for source in sources:
        print(f"Title: {source['title']}")
        print(f"Score: {source['score']:.4f}")
        print(
            f"Time: {source['start']:.2f}s → "
            f"{source['end']:.2f}s"
        )
        print(f"URL: {source['url']}")
        print("-" * 80)

if __name__ == "__main__":
    main()