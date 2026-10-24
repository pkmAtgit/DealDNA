"use client";

import React, { useRef } from "react";

// Common real estate & sales spelling mistakes to underline in red
const KNOWN_SPELLING_MISTAKES = new Set([
  "intrested", "intrest", "salery", "dealey", "deley", "experiance",
  "negotation", "commited", "finanace", "appartment", "disount", "recieved"
]);

// Basic English vocabulary set (Expandable)
const BASIC_EN_WORDS = new Set([
  "hi", "hello", "sales", "executive", "customer", "following", "up", "on",
  "do", "you", "have", "another", "unit", "not", "interested", "property",
  "the", "is", "we", "can", "send", "options", "call", "later", "this", "flat",
  "project", "tower", "price", "budget", "discount", "ready", "token", "loan",
  "bank", "approval", "possession", "schedule", "revisit", "family", "residences",
  "palm", "springs", "riverside", "maple", "oakwood", "commercial"
]);

interface SmartTranscriptEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function SmartTranscriptEditor({
  value,
  onChange,
  placeholder = "Type spoken transcript here...",
  rows = 4
}: SmartTranscriptEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Sync scroll between textarea and background highlight overlay
  const handleScroll = () => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Render text with red wavy underlines under misspelled words
  const renderHighlightedContent = () => {
    if (!value) {
      return <span className="text-slate-400 select-none">{placeholder}</span>;
    }

    // Split text preserving spaces and punctuation
    const tokens = value.split(/(\s+|[.,!?:;]+)/);

    return tokens.map((token, index) => {
      const cleanWord = token.toLowerCase().trim();

      const isKnownMistake = KNOWN_SPELLING_MISTAKES.has(cleanWord);
      
      // Agar explicit mistake list me hai, ya English format me galat word hai
      const shouldUnderline = isKnownMistake;

      if (shouldUnderline) {
        return (
          <span
            key={index}
            className="text-transparent border-b-2 border-red-500 border-dotted"
            style={{ textDecoration: "underline wavy #ef4444", textUnderlineOffset: "3px" }}
            title={`Possible spelling mistake: ${token}`}
          >
            {token}
          </span>
        );
      }

      return (
        <span key={index} className="text-transparent">
          {token}
        </span>
      );
    });
  };

  return (
    <div className="relative w-full border border-slate-300 rounded-md focus-within:ring-1 focus-within:ring-indigo-500 bg-white">
      {/* Background Highlight Layer */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        className="absolute inset-0 p-2.5 font-mono text-xs whitespace-pre-wrap break-words overflow-auto pointer-events-none select-none z-0"
        style={{ minHeight: `${rows * 1.5}rem` }}
      >
        {renderHighlightedContent()}
      </div>

      {/* Foreground Editable Textarea */}
      <textarea
        ref={textareaRef}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        placeholder={placeholder}
        className="relative w-full p-2.5 font-mono text-xs bg-transparent text-slate-800 placeholder-transparent resize-y focus:outline-none z-10"
      />
    </div>
  );
}