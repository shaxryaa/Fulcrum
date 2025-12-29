'use client';

import { useState, useEffect } from 'react';

export default function HighlightCard({ initialHighlight, onUpdate }) {
  const [highlight, setHighlight] = useState(initialHighlight || '');
  const [saveTimeout, setSaveTimeout] = useState(null);

  useEffect(() => {
    setHighlight(initialHighlight || '');
  }, [initialHighlight]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setHighlight(newValue);

    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // Set new timeout to auto-save after 1 second
    const timeout = setTimeout(() => {
      onUpdate(newValue);
    }, 1000);

    setSaveTimeout(timeout);
  };

  return (
    <div className="p-6 border border-[#E5E5E5] rounded bg-white">
      <h3 className="text-lg font-semibold mb-4 tracking-tight">Today's Highlight</h3>

      <textarea
        value={highlight}
        onChange={handleChange}
        placeholder="What's your highlight for today?"
        rows={3}
        className="w-full p-4 border border-[#E5E5E5] rounded text-sm leading-relaxed resize-y transition-colors duration-200 focus:outline-none focus:border-black bg-white"
      />
    </div>
  );
}
