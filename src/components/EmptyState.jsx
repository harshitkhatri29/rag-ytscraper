import React from 'react';
import { Search, Sparkles, BookOpen, Youtube, ArrowRight } from 'lucide-react';

export default function EmptyState({ onSelectPrompt }) {
  return (
    <div className="empty-state-card animated-entry">
      <div className="empty-icon-wrapper">
        <Sparkles size={32} />
      </div>

      <h2 className="state-title">Ready to Learn Data Structures?</h2>

      <p className="state-description">
        Type any DSA topic or concept in the search bar above to generate structured summaries
        and jump directly to relevant YouTube lecture segments.
      </p>

      <div className="features-grid">
        <div className="feature-box">
          <BookOpen size={18} style={{ color: '#38BDF8', marginBottom: '0.4rem' }} />
          <div className="feature-box-title">Smart Summaries</div>
          <div className="feature-box-desc">Clear, concise explanations extracted directly from top lecture transcripts.</div>
        </div>

        <div className="feature-box">
          <Youtube size={18} style={{ color: '#F43F5E', marginBottom: '0.4rem' }} />
          <div className="feature-box-title">Timestamp Jump</div>
          <div className="feature-box-desc">Direct links to exact start times in video lectures so you never waste time scrubbing.</div>
        </div>

        <div className="feature-box">
          <Search size={18} style={{ color: '#6366F1', marginBottom: '0.4rem' }} />
          <div className="feature-box-title">Semantic RAG Search</div>
          <div className="feature-box-desc">Find answers based on context and meaning, not just simple keyword matching.</div>
        </div>
      </div>
    </div>
  );
}
