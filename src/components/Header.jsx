import React from 'react';
import { PlayCircle, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="container header-content">
        <div className="brand-section">
          <div className="brand-logo">
            <PlayCircle size={24} />
          </div>
          <div>
            <div className="brand-title">RAG Playlist</div>
            <div className="brand-subtitle">Ask questions. Find the lecture. Learn faster.</div>
          </div>
        </div>

        <div className="status-badge" title="Connected to FastAPI http://127.0.0.1:8000">
          <span className="status-dot"></span>
          <span>API Connected</span>
        </div>
      </div>
    </header>
  );
}
