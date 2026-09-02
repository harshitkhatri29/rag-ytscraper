import React, { forwardRef } from 'react';
import { Search, Loader2, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

interface HeroProps {
  question: string;
  setQuestion: (q: string) => void;
  onSubmit: (q?: string) => void;
  isLoading: boolean;
}

const EXAMPLE_QUESTIONS = [
  "What is the sliding window technique?",
  "What is a HashMap and when to use it?",
  "Explain the Prefix Sum array pattern."
];

const Hero = forwardRef<HTMLInputElement, HeroProps>(
  ({ question, setQuestion, onSubmit, isLoading }, ref) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!question.trim() || isLoading) return;
      onSubmit();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (question.trim() && !isLoading) {
          onSubmit();
        }
      }
    };

    const handleSelectExample = (exampleText: string) => {
      setQuestion(exampleText);
      onSubmit(exampleText);
    };

    return (
      <section id="ask" className="relative z-10 flex flex-col items-center text-center px-6 pt-16 sm:pt-24 pb-16 max-w-7xl mx-auto">
        {/* H1 Heading - Instrument Serif */}
        <h1 
          className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-5xl font-normal text-foreground animate-fade-rise"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Find the <em className="not-italic text-muted-foreground">exact moment</em> your concept was taught.
        </h1>

        {/* Subtext - Inter */}
        <p className="font-sans text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay">
          Ask questions about your DSA lectures and get clear explanations grounded in your lecture content, with the exact video moments where the concept was discussed.
        </p>

        {/* Interactive Search / Question Input Container */}
        <div className="w-full max-w-2xl mt-12 animate-fade-rise-delay-2">
          <form onSubmit={handleSubmit} className="relative w-full">
            <div className="liquid-glass rounded-full p-2 pl-6 flex items-center gap-3 transition-all duration-300 hover:border-white/30 focus-within:ring-2 focus-within:ring-sky-400/40 focus-within:border-sky-400/50 shadow-lg hover:shadow-sky-500/10">
              <Search className="w-5 h-5 text-muted-foreground shrink-0 transition-colors group-focus-within:text-sky-400" />
              
              <input
                ref={ref}
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a DSA question..."
                disabled={isLoading}
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/60 text-base outline-none font-sans py-2"
              />

              <button
                type="submit"
                disabled={!question.trim() || isLoading}
                className="liquid-glass rounded-full px-7 py-3 text-sm font-medium text-foreground hover:scale-[1.03] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shrink-0 flex items-center gap-2 font-sans cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                    <span className="text-sky-300">Searching...</span>
                  </>
                ) : (
                  <>
                    <span>Ask</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Loading Indicator or Try Prompt Hint */}
          <div className="mt-4 min-h-[24px]">
            {isLoading ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-sans animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Finding the relevant lecture moments...</span>
              </div>
            ) : (
              <div className="font-sans text-xs text-muted-foreground/80 tracking-wide flex items-center justify-center gap-1.5 flex-wrap">
                <span>Try:</span>
                <button
                  type="button"
                  onClick={() => handleSelectExample("What is the sliding window technique?")}
                  className="text-foreground/90 hover:text-sky-300 underline decoration-white/20 hover:decoration-sky-300 transition-colors cursor-pointer bg-transparent border-none p-0 font-sans"
                >
                  What is the sliding window technique?
                </button>
              </div>
            )}
          </div>

          {/* Clickable Example Questions Pills */}
          <div className="mt-8 flex items-center justify-center gap-2.5 flex-wrap">
            <span className="text-xs text-muted-foreground font-sans mr-1 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Popular questions:</span>
            </span>
            {EXAMPLE_QUESTIONS.map((ex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectExample(ex)}
                disabled={isLoading}
                className="liquid-glass rounded-full px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:scale-[1.03] transition-all cursor-pointer font-sans disabled:opacity-50"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

Hero.displayName = 'Hero';

export default Hero;
