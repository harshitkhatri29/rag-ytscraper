import React, { useState } from 'react';
import { marked } from 'marked';
import { Play, Copy, Check, Clock, ExternalLink, Sparkles, ArrowUp } from 'lucide-react';
import { formatSeconds, formatScore } from '../utils/formatters';

interface Source {
  video_id: string;
  title: string;
  start: number;
  end: number;
  url: string;
  score: number;
}

interface ResultsViewProps {
  answer: string;
  sources: Source[];
  onAskAnother: () => void;
}

export default function ResultsView({ answer, sources, onAskAnother }: ResultsViewProps) {
  const [copied, setCopied] = useState(false);

  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  const parsedAnswer = marked.parse(answer || '');

  const handleCopy = () => {
    if (!answer) return;
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="results" className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-32 animate-fade-rise">
      {/* Ask Another Question Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-sans text-muted-foreground uppercase tracking-wider">
            Results Generated
          </span>
        </div>

        <button
          onClick={onAskAnother}
          className="liquid-glass rounded-full px-4 py-2 text-xs font-medium text-foreground hover:scale-[1.03] transition-all cursor-pointer font-sans flex items-center gap-1.5"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Ask another question</span>
        </button>
      </div>

      {/* Answer Content Card - Slightly darker/more opaque (rgba(8, 12, 20, 0.88)) for maximum text contrast */}
      <div 
        className="rounded-3xl p-8 sm:p-12 mb-12 relative overflow-hidden backdrop-blur-2xl border border-white/10 shadow-2xl transition-all"
        style={{ background: 'rgba(8, 12, 20, 0.88)' }}
      >
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white">
              <Sparkles className="w-5 h-5 text-sky-400" />
            </div>
            {/* Title: Answer (Instrument Serif) */}
            <h2 
              className="text-2xl sm:text-3xl text-foreground font-normal tracking-tight"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Answer
            </h2>
          </div>

          <button
            onClick={handleCopy}
            className="liquid-glass rounded-full px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-all cursor-pointer font-sans"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-sans">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="font-sans">Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Markdown Output */}
        <div 
          className="markdown-content font-sans text-base sm:text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: parsedAnswer }}
        />
      </div>

      {/* Relevant Moments Section */}
      {sources && sources.length > 0 && (
        <div id="lectures" className="w-full">
          <div className="flex items-center justify-between mb-8">
            {/* Heading: Relevant Moments (Instrument Serif) */}
            <h2 
              className="text-3xl sm:text-4xl text-foreground font-normal tracking-tight"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Relevant Moments
            </h2>
            <span className="text-xs font-mono text-muted-foreground px-3 py-1 rounded-full bg-white/5 border border-white/10">
              {sources.length} Moments Found
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sources.map((source, index) => {
              const startFormatted = formatSeconds(source.start);
              const endFormatted = formatSeconds(source.end);

              return (
                <div 
                  key={index}
                  className="liquid-card rounded-2xl p-6 flex flex-col justify-between gap-6 hover:border-white/20 transition-all hover:-translate-y-1 group"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      {/* Video Title */}
                      <h3 className="font-sans text-base font-medium text-foreground line-clamp-2 leading-snug group-hover:text-sky-300 transition-colors">
                        {source.title}
                      </h3>
                      {/* KEEP Percentage Match Score intact */}
                      <span className="font-sans text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 shrink-0">
                        {formatScore(source.score)}
                      </span>
                    </div>

                    {/* Visually Prominent Timestamp Range */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300 w-fit mt-1">
                      <Clock className="w-4 h-4 text-sky-400" />
                      <span className="font-mono text-xs font-semibold tracking-wider">
                        {startFormatted} – {endFormatted}
                      </span>
                    </div>
                  </div>

                  {/* Watch this moment Button */}
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="liquid-glass rounded-xl px-5 py-3 text-sm font-medium text-foreground flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group/btn font-sans"
                  >
                    <Play className="w-4 h-4 fill-current text-white group-hover/btn:scale-110 transition-transform" />
                    <span>Watch this moment</span>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground ml-auto group-hover/btn:text-foreground transition-colors" />
                  </a>
                </div>
              );
            })}
          </div>

          {/* Bottom Ask Another Question CTA */}
          <div className="mt-12 text-center">
            <button
              onClick={onAskAnother}
              className="liquid-glass rounded-full px-8 py-3.5 text-sm font-medium text-foreground hover:scale-[1.03] transition-all cursor-pointer font-sans inline-flex items-center gap-2 shadow-lg"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Ask another DSA question</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
