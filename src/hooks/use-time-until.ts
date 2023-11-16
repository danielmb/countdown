import React, { useEffect, useState } from 'react';
interface Timeuntil {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export const getTimeUntil = (date: Date) => {
  const now = new Date();
  const timeUntil = date.getTime() - now.getTime();
  const days = Math.floor(timeUntil / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeUntil % (1000 * 60)) / 1000);
  const milliseconds = Math.floor(timeUntil % 1000);
  return { days, hours, minutes, seconds, milliseconds };
};

const stringifyTime = (time: number, padStart = 2) => {
  // will turn 2 into 02
  return time.toString().padStart(padStart, ' ');
};
const useTimeUntil = (date: Date) => {
  const targetDateStorage = date.toISOString();
  const [now, setNow] = useState(new Date());
  const [timeUntil, setTimeUntil] = useState<Timeuntil>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const targetDate = new Date(targetDateStorage);
      const now = new Date();
      const timeUntil = targetDate.getTime() - now.getTime();
      const days = Math.floor(timeUntil / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeUntil % (1000 * 60)) / 1000);
      const milliseconds = Math.floor(timeUntil % 1000);
      setTimeUntil({ days, hours, minutes, seconds, milliseconds });
      setNow(now);
    }, 1);
    return () => clearInterval(interval);
  }, [targetDateStorage]);
  const stringifiedTime = {
    days: stringifyTime(timeUntil.days),
    hours: stringifyTime(timeUntil.hours),
    minutes: stringifyTime(timeUntil.minutes),
    seconds: stringifyTime(timeUntil.seconds),
    milliseconds: stringifyTime(timeUntil.milliseconds, 3),
  };
  return {
    ...timeUntil,
    stringifiedTime,
    targetDate: targetDateStorage,
    now,
  };
};

export default useTimeUntil;
