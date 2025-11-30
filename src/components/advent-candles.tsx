'use client';
import React, { useEffect, useState } from 'react';
import { getAdventStatus } from '../lib/advent';
export const AdventCandles = () => {
  const [litCount, setLitCount] = useState(0);

  useEffect(() => {
    setLitCount(getAdventStatus());
  }, []);

  // Don't render anything if Advent hasn't started yet
  if (litCount === 0) return null;

  return (
    // Positioned at bottom-right or centered-bottom depending on preference
    <div className="fixed bottom-8 right-8 z-40 flex gap-6 items-end animate-in fade-in duration-1000">
      {[1, 2, 3, 4].map((num) => (
        <div key={num} className="flex flex-col items-center relative">
          {/* The Flame (Only visible if lit) */}
          <div
            className={`w-3 h-5 bg-yellow-200 rounded-[50%] absolute -top-5 blur-[1px] transition-opacity duration-1000 ${
              num <= litCount ? 'opacity-100 animate-pulse' : 'opacity-0'
            }`}
            style={{
              boxShadow: '0 0 15px #fcd34d, 0 0 30px #f59e0b',
              animationDuration: '1.5s',
            }}
          />

          {/* Candle Body (Purple for Advent) */}
          {/* Changes to Red on Christmas Eve/Day if you want? */}
          <div
            className="w-8 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 rounded-sm shadow-lg relative border-t border-purple-400/30"
            style={{ height: `${60 + num * 15}px` }} // Stairstep height (Norwegian style)
          >
            {/* Wick */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-black/50" />
          </div>

          {/* Simple holder/base */}
          <div className="w-10 h-2 bg-stone-800 rounded-full mt-[-1px] shadow-sm" />
        </div>
      ))}
    </div>
  );
};
