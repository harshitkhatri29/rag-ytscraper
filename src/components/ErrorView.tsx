import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorViewProps {
  onRetry?: () => void;
}

export default function ErrorView({ onRetry }: ErrorViewProps) {
  return (
    <div className="relative z-10 max-w-md mx-auto my-12 px-6 animate-fade-rise">
      <div className="liquid-card rounded-2xl p-8 text-center flex flex-col items-center gap-4">
        <div className="p-3 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h3 
          className="text-2xl text-foreground font-normal"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Something went wrong. Please try again.
        </h3>

        <p className="text-sm text-muted-foreground font-sans">
          We could not complete your request. Please check that the server is running and try asking again.
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="liquid-glass rounded-full px-6 py-2.5 text-xs font-medium text-foreground flex items-center gap-2 hover:scale-[1.03] transition-all cursor-pointer mt-2 font-sans"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
}
