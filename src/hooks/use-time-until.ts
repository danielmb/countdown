import React, { useEffect, useState } from 'react';
interface Timeuntil {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

const useTimeUntil = (date: Date) => {
  const targetDateStorage = date.toISOString();
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
    }, 1);
    return () => clearInterval(interval);
  }, [targetDateStorage]);
  return timeUntil;
};

export default useTimeUntil;
