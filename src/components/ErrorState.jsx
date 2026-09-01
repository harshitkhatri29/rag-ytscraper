import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="error-state-card animated-entry">
      <div className="error-icon-wrapper">
        <AlertTriangle size={32} />
      </div>

      <h2 className="state-title">Unable to fetch lecture results</h2>

      <p className="state-description">
        {error || "An unexpected error occurred while communicating with the backend server."}
      </p>

      {onRetry && (
        <button className="retry-button" onClick={onRetry} type="button">
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
