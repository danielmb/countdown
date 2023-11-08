import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { FlapDisplay, Presets } from 'react-split-flap-effect';
import useTimeUntil from '../hooks/use-time-until';
import './timer.css';
function Timer() {
  const timeUntil = useTimeUntil(new Date('2023-12-24T17:00:00.000Z'));
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
        <FlapDisplay
          chars={Presets.ALPHANUM}
          length={5}
          value={timeUntil.seconds <= 1 ? 'Dag' : 'Dager'}
          className="text-4xl"
        />
      </div>
      <div className="flex flex-col items-center justify-center space-y-4 rounded-full border-2 p-6 w-96 h-96 bg-red-600 bg-opacity-60">
        <FlapDisplay
          chars={` 9876543210`}
          length={2}
          // value={`Hello World!`}
          value={timeUntil.stringifiedTime.hours}
          className="text-4xl"
        />
        <FlapDisplay
          chars={Presets.ALPHANUM}
          length={5}
          value={timeUntil.hours <= 1 ? 'Time' : 'Timer'}
          className="text-4xl"
        />
      </div>
      <div className="flex flex-col items-center justify-center space-y-4 rounded-full border-2 p-6 w-96 h-96 bg-red-600 bg-opacity-60">
        <FlapDisplay
          chars={` 9876543210`}
          length={2}
          // value={`Hello World!`}
          value={timeUntil.stringifiedTime.minutes}
          className="text-4xl"
        />
        {/* <h1 className="text-4xl">Minutter</h1> */}
        <FlapDisplay
          chars={Presets.ALPHANUM}
          length={8}
          value={timeUntil.minutes <= 1 ? 'minutt' : 'minutter'}
          className="text-4xl"
        />
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
        {/* <h1 className="text-4xl">Sekunder</h1> */}
        <FlapDisplay
          chars={Presets.ALPHANUM}
          length={8}
          value={timeUntil.seconds <= 1 ? 'Sekund' : 'Sekunder'}
          className="text-4xl"
        />
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
