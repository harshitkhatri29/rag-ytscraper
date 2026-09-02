import React, { useState, useRef } from 'react';
import VideoBackground from './components/VideoBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ResultsView from './components/ResultsView';
import ErrorView from './components/ErrorView';

const API_URL = 'http://127.0.0.1:8000/ask';

interface Source {
  video_id: string;
  title: string;
  start: number;
  end: number;
  url: string;
  score: number;
}

interface ApiResponse {
  answer: string;
  sources: Source[];
}

export default function App() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Home Handler: Reset page to initial landing state
  const handleHomeClick = () => {
    setQuestion('');
    setResult(null);
    setError(false);
    setIsLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ask Handler: Focus search input & scroll smoothly into view
  const handleAskClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleAsk = async (overrideQuestion?: string) => {
    const targetQuery = (overrideQuestion || question).trim();
    if (!targetQuery || isLoading) return;

    setIsLoading(true);
    setError(false);
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: targetQuery }),
      });

      if (!response.ok) {
        throw new Error('Backend returned invalid response');
      }

      const data: ApiResponse = await response.json();

      if (!data || typeof data.answer !== 'string') {
        throw new Error('Invalid data format');
      }

      setResult(data);

      // Smooth scroll to results section after render
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } catch (err) {
      console.error('API Error:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#002943] text-white flex flex-col justify-between overflow-x-hidden selection:bg-white/20 selection:text-white font-sans">
      {/* Fixed Fullscreen Looping Background Video */}
      <VideoBackground />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        <div>
          <Navbar 
            onHomeClick={handleHomeClick} 
            onAskClick={handleAskClick} 
          />

          <Hero
            ref={inputRef}
            question={question}
            setQuestion={setQuestion}
            onSubmit={handleAsk}
            isLoading={isLoading}
          />

          <div ref={resultsRef}>
            {error && <ErrorView onRetry={() => handleAsk(question)} />}

            {result && !error && (
              <ResultsView 
                answer={result.answer} 
                sources={result.sources}
                onAskAnother={handleAskClick}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 w-full py-8 text-center text-xs text-muted-foreground/60 border-t border-white/5 font-sans">
          <div className="max-w-7xl mx-auto px-6">
            LectureLens &copy; {new Date().getFullYear()} &bull; Find the exact lecture moment
          </div>
        </footer>
      </div>
    </div>
  );
}
