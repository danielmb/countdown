import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { FlapDisplay, Presets } from 'react-split-flap-effect';
import useTimeUntil from '../hooks/use-time-until';
import './timer.css';
function Timer() {
  const timeUntil = useTimeUntil(new Date('2023-12-24T11:04:00.000Z'));
  const { stringifiedTime } = timeUntil;
  // every day at 12:49

  return (
    <div className="flex flex-row items-center justify-center space-x-4">
      <div className="flex flex-col items-center justify-center space-y-4 rounded-full border-2 p-6 w-96 h-96 bg-red-600 bg-opacity-60">
        <FlapDisplay
          chars={` 9876543210`}
          length={2}
          // value={`Hello World!`}
          value={timeUntil.stringifiedTime.days}
          className="text-4xl flip"
        />
        <h1 className="text-4xl">Dager</h1>
      </div>
      <div className="flex flex-col items-center justify-center space-y-4 rounded-full border-2 p-6 w-96 h-96 bg-red-600 bg-opacity-60">
        <FlapDisplay
          chars={` 9876543210`}
          length={2}
          // value={`Hello World!`}
          value={timeUntil.stringifiedTime.hours}
          className="text-4xl"
        />
        <h1 className="text-4xl">Timer</h1>
      </div>
      <div className="flex flex-col items-center justify-center space-y-4 rounded-full border-2 p-6 w-96 h-96 bg-red-600 bg-opacity-60">
        <FlapDisplay
          chars={` 9876543210`}
          length={2}
          // value={`Hello World!`}
          value={timeUntil.stringifiedTime.minutes}
          className="text-4xl"
        />
        <h1 className="text-4xl">Minutter</h1>
      </div>
      <div className="flex flex-col items-center justify-center space-y-4 rounded-full border-2 p-6 w-96 h-96 bg-red-600 bg-opacity-60">
        <FlapDisplay
          chars={` 9876543210`}
          length={2}
          // value={`Hello World!`}
          value={timeUntil.stringifiedTime.seconds}
          className="text-4xl"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        />
        <h1 className="text-4xl">Sekunder</h1>
      </div>
      {/* <div>
        <h1>Millisekunder</h1>
        <FlapDisplay
          chars={` 9876543210:`}
          length={3}
          // value={`Hello World!`}
          value={timeUntil.stringifiedTime.milliseconds}
        />
      </div> */}
    </div>
  );
}

export default Timer;
