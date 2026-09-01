import React, { useState, useRef } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SearchForm from './components/SearchForm';
import AnswerCard from './components/AnswerCard';
import SourceCardList from './components/SourceCardList';
import SkeletonLoader from './components/SkeletonLoader';
import EmptyState from './components/EmptyState';
import ErrorState from './components/ErrorState';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function App() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null); // { answer: string, sources: Array }
  const [error, setError] = useState(null);
  
  const resultsRef = useRef(null);

  const handleAskQuestion = async (qText) => {
    const targetQuestion = qText || question;
    if (!targetQuestion.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: targetQuestion }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || typeof data.answer !== 'string') {
        throw new Error('Invalid response format received from backend API.');
      }

      setResult(data);

      // Smooth scroll to answer after short render tick
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (err) {
      console.error('Error querying backend:', err);
      setError(err.message || 'Could not connect to FastAPI backend at http://127.0.0.1:8000.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptSelect = (promptText) => {
    setQuestion(promptText);
    handleAskQuestion(promptText);
  };

  return (
    <>
      <Header />

      <main className="main-content">
        <HeroSection onSelectPrompt={handlePromptSelect} />

        <SearchForm
          question={question}
          setQuestion={setQuestion}
          onSubmit={handleAskQuestion}
          isLoading={isLoading}
        />

        <div className="container" ref={resultsRef}>
          {isLoading && <SkeletonLoader />}

          {error && (
            <ErrorState
              error={error}
              onRetry={() => handleAskQuestion(question)}
            />
          )}

          {!isLoading && !error && result && (
            <div className="results-container">
              <AnswerCard answer={result.answer} />
              <SourceCardList sources={result.sources} />
            </div>
          )}

          {!isLoading && !error && !result && (
            <EmptyState onSelectPrompt={handlePromptSelect} />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          RAG Playlist &copy; {new Date().getFullYear()} &bull; Fast LLM Lecture Transcript Search
        </div>
      </footer>
    </>
  );
}
