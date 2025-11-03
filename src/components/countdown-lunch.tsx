import React, { useMemo, useState } from 'react';
import { useInterval } from '../hooks/use-interval';
import WindowsLoading from './windows-loading';

function CountDownLunch() {
  const [now, setNow] = useState(new Date());
  const [[lunchTimeStart, lunchTimeEnd], setLunchTimes] = useState<
    [[number, number], [number, number]]
  >([
    [11, 0],
    [22, 30],
  ]);
  // const [remainingTime, setRemainingTime] = useState('0 minutter gjenstår');
  const remainingTime = useMemo(() => {
    const minDate = new Date();
    // minDate.setHours(lunchTimes[0][0], lunchTimes[0][1], 0, 0);
    minDate.setHours(lunchTimeStart[0], lunchTimeStart[1], 0, 0);
    const maxDate = new Date();
    // maxDate.setHours(16, 59, 59, 0);
    maxDate.setHours(lunchTimeEnd[0], lunchTimeEnd[1], 0, 0);
    const total = maxDate.getTime() - minDate.getTime();
    const current = now.getTime() - minDate.getTime();
    const remainingTime = total - current;
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);
    if (remainingTime <= 0) {
      return '0 Minutter Gjenstår';
    }
    if (minutes === 0) {
      if (seconds === 1) {
        return `${seconds} Sekund Gjenstår`;
      }
      return `${seconds} Sekunder Gjenstår`;
    }
    if (minutes > 0) {
      if (minutes === 1) {
        return `${minutes} Minutt Gjenstår`;
      }
      return `${minutes} Minutter Gjenstår`;
    }
    // return `${minutes} minutter og ${seconds} sekunder gjenstår`;
  }, [lunchTimeStart, lunchTimeEnd, now]);
  const progress = useMemo(() => {
    const today = new Date();
    const minDate = new Date();
    minDate.setHours(lunchTimeStart[0], lunchTimeStart[1], 0, 0);
    const maxDate = new Date();
    maxDate.setHours(lunchTimeEnd[0], lunchTimeEnd[1], 0, 0);
    const total = maxDate.getTime() - minDate.getTime();
    const current = now.getTime() - minDate.getTime();
    const progressUntil = Math.min(Math.max(current / total, 0), 1);
    return progressUntil;
  }, [now, lunchTimeStart, lunchTimeEnd]);

  useInterval(() => {
    setNow(new Date());
  }, 1000);

  return (
    <div>
      <WindowsLoading
        progress={progress}
        bodyText="Laster ned lunsj..."
        titleText="Lunsj"
        remainingTime={remainingTime}
      />
    </div>
  );
}

export default CountDownLunch;
