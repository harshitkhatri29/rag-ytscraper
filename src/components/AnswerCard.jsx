import React, { useState } from 'react';
import { marked } from 'marked';
import { Bot, Copy, Check } from 'lucide-react';

export default function AnswerCard({ answer }) {
  const [copied, setCopied] = useState(false);

  // Configure marked options for clean rendering
  marked.setOptions({
    gfm: true,
    breaks: true
  });

  const rawHtml = marked.parse(answer || '');

  const handleCopy = () => {
    if (!answer) return;
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="answer-card animated-entry">
      <div className="answer-header">
        <div className="answer-title-group">
          <div className="answer-icon-badge">
            <Bot size={20} />
          </div>
          <h2 className="answer-title">Explanation</h2>
        </div>
        
        <button
          className="copy-button"
          onClick={handleCopy}
          type="button"
          title="Copy explanation text"
        >
          {copied ? (
            <>
              <Check size={14} style={{ color: '#10B981' }} />
              <span style={{ color: '#10B981' }}>Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: rawHtml }}
      />
    </div>
  );
}
