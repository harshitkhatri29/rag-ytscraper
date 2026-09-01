import React from 'react';
import { Video, Play, ExternalLink, Clock } from 'lucide-react';
import { formatSeconds, formatScore } from '../utils/formatters';

export default function SourceCardList({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="sources-section animated-entry">
      <div className="sources-header">
        <div className="sources-title-group">
          <Video size={20} className="sources-icon" style={{ color: '#38BDF8' }} />
          <h2 className="sources-title">Relevant Lecture Segments</h2>
          <span className="sources-count">{sources.length} lectures found</span>
        </div>
      </div>

      <div className="sources-grid">
        {sources.map((source, index) => {
          const startTimeFormatted = formatSeconds(source.start);
          const endTimeFormatted = formatSeconds(source.end);

          return (
            <div key={index} className="source-card">
              <div className="source-header">
                <h3 className="video-title" title={source.title}>
                  {source.title}
                </h3>
                <span className="match-badge">
                  {formatScore(source.score)}
                </span>
              </div>

              <div className="timestamp-container">
                <Clock size={15} className="timestamp-icon" />
                <span className="timestamp-text">
                  {startTimeFormatted} – {endTimeFormatted}
                </span>
              </div>

              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="watch-button"
              >
                <Play size={15} fill="currentColor" />
                <span>Watch Lecture</span>
                <ExternalLink size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
