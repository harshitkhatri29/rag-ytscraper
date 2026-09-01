import React from 'react';
import { Sparkles, Terminal, Code, Hash, Layers } from 'lucide-react';

const SAMPLE_PROMPTS = [
  { icon: Hash, text: "What is a HashMap?" },
  { icon: Layers, text: "How does Sliding Window pattern work?" },
  { icon: Code, text: "Explain Prefix Sum array with an example." }
];

export default function HeroSection({ onSelectPrompt }) {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>AI-Powered DSA Video Search</span>
        </div>
        
        <h1 className="hero-heading">
          Learn DSA from the <span className="gradient-text">right lecture.</span>
        </h1>
        
        <p className="hero-description">
          Ask any Data Structures & Algorithms question. Our AI agent searches lecture transcripts
          and pinpoints the exact video timestamps for instant clarity.
        </p>

        <div className="sample-prompts">
          {SAMPLE_PROMPTS.map((prompt, idx) => {
            const Icon = prompt.icon;
            return (
              <button
                key={idx}
                className="prompt-pill"
                onClick={() => onSelectPrompt(prompt.text)}
                type="button"
              >
                <Icon size={14} />
                <span>{prompt.text}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
