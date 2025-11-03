import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useInterval } from '../hooks/use-interval';
import './flap-display.css';
interface PanelProps {
  letter: string;
  position: 'top' | 'bottom';
  duration?: number;
  animate?: boolean;
}
const Panel = ({ letter, position, duration, animate }: PanelProps) => {
  return (
    <div
      style={{ '--duration': `${duration || 0.5}s` } as React.CSSProperties}
      className={`${
        position === 'top'
          ? `relative ${animate ? 'animate-flip-out' : ''}`
          : `absolute ${animate ? 'animate-flip-in' : ''}`
      } overflow-hidden w-full flex justify-center
        `}
    >
      <div
        className={`${
          position === 'top' ? 'flip-gradient-top' : 'flip-gradient-bottom'
        }
         text-transparent bg-clip-text text-4xl font-bold`}
      >
        {letter}
      </div>
    </div>
  );
};

const FlipAnimation = ({ children }: { children?: React.ReactNode }) => {
  return (
    <motion.div
      className="flip-animation"
      initial={{ rotateX: 0 }}
      animate={{ rotateX: 180 }}
      exit={{ rotateX: 0 }}
      transition={{ duration: 10 }}
    >
      {children}
    </motion.div>
  );
};
interface SingleSplitFlapProps {
  targetLetter: string; // 1 letter
  letters: string[];
  randomize?: number;
  speed?: number;
}
const SingleSplitFlap = ({
  targetLetter,
  letters,
  randomize,
  speed,
}: SingleSplitFlapProps) => {
  const [prevLetter, setPrevLetter] = useState(letters[0]); // letters[0
  const [currentLetter, setCurrentLetter] = useState(0);

  useInterval(() => {
    // if not target letter then increment % letters.length
    if (letters[currentLetter] !== targetLetter) {
      setCurrentLetter((currentLetter + 1) % letters.length);
      setPrevLetter(letters[currentLetter]);
    } else {
      // if prev letter is not target letter then set prev letter to target letter
      if (prevLetter !== targetLetter) {
        setPrevLetter(targetLetter);
      }
    }
  }, (speed || 100) + Math.random() * (randomize || 25));

  return (
    <div
      className="flex flex-col items-center justify-center w-10 h-24 transition-all"
      key={currentLetter}
    >
      {/* <p className="text-2xl bg-white text-black w-10 h-10 border-2 text-center">
        {letters[currentLetter]}
      </p>
      <p className="text-2xl bg-white text-black w-10 h-10 border-2 text-center">
        {letters[currentLetter]}
      </p> */}
      {/* Cut letters in two */}
      {/* <p className="text-2xl bg-white text-black w-10 h-10 border-2 text-center">
        {letters[currentLetter]}
      </p> */}

      <Panel letter={letters[currentLetter]} position="top" duration={0.5} />
      <Panel
        letter={prevLetter}
        position="bottom"
        duration={0.5}
        animate={letters[currentLetter] !== targetLetter}
      />
    </div>
  );
};

export default SingleSplitFlap;

interface SplitFlapProps {
  length: number; // should be constant
  targetWord: string;
  letters: string[];
}
export const SplitFlap = ({ length, targetWord, letters }: SplitFlapProps) => {
  const [currentWord, setCurrentWord] = useState(
    letters.slice(0, length).join(''),
  );

  return (
    <div className="flex flex-row">
      {letters.slice(0, length).map((letter, i) => (
        <SingleSplitFlap
          key={i}
          targetLetter={targetWord[i]}
          letters={letters}
        />
      ))}
    </div>
  );
};
