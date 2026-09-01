import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="results-container">
      {/* Answer skeleton */}
      <div className="answer-card">
        <div className="skeleton skeleton-text-line short" style={{ height: '24px', marginBottom: '1.5rem' }}></div>
        <div className="skeleton skeleton-text-line"></div>
        <div className="skeleton skeleton-text-line"></div>
        <div className="skeleton skeleton-text-line short"></div>
        <div className="skeleton skeleton-text-line" style={{ height: '80px', marginTop: '1rem' }}></div>
      </div>

      {/* Sources skeleton */}
      <div className="sources-section">
        <div className="skeleton skeleton-text-line short" style={{ height: '20px', width: '220px', marginBottom: '1rem' }}></div>
        <div className="sources-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="source-card">
              <div className="skeleton skeleton-text-line" style={{ height: '18px', width: '85%' }}></div>
              <div className="skeleton skeleton-text-line short" style={{ height: '26px', width: '120px', borderRadius: '10px' }}></div>
              <div className="skeleton skeleton-text-line" style={{ height: '36px', borderRadius: '10px', marginTop: 'auto' }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
