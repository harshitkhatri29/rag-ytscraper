import React from 'react';
import { Search, Loader2, SendHorizontal } from 'lucide-react';

export default function SearchForm({ question, setQuestion, onSubmit, isLoading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    onSubmit(question);
  };

  return (
    <section className="search-section">
      <div className="container">
        <form className="search-form-container" onSubmit={handleSubmit}>
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a DSA question (e.g. What is a HashMap?)..."
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              className="search-button"
              disabled={!question.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="spinner" size={18} />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Ask AI</span>
                  <SendHorizontal size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
