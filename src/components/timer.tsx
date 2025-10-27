import React, { useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { FlapDisplay, Presets } from 'react-split-flap-effect';
import useTimeUntil from '../hooks/use-time-until';
import './timer.css';
import { useDate } from '../hooks/use-cron';
import { FlatProgressBar } from './progress';
import santa from '../assets/santa.png';

import WindowsLoading from './windows-loading';
import { text } from 'stream/consumers';
import { cn } from '../lib/utils';

const ribbonBaseStyle = 'absolute bg-yellow-400';
const ribbonVerticalStyle = `${ribbonBaseStyle} w-4 h-full top-0`;
const ribbonHorizontalStyle = `${ribbonBaseStyle} h-4 w-full left-0`;

const getAdvents = () => {
  const advents: string[] = [];
  const year = new Date().getFullYear();
  const nov30 = new Date(`${year}-11-30 00:00`);
  const firstAdvent = new Date(
    nov30.getTime() + (7 - nov30.getDay()) * 24 * 60 * 60 * 1000,
  );
  const secondAdvent = new Date(
    firstAdvent.getTime() + 7 * 24 * 60 * 60 * 1000,
  );
  const thirdAdvent = new Date(
    secondAdvent.getTime() + 7 * 24 * 60 * 60 * 1000,
  );
  const fourthAdvent = new Date(
    thirdAdvent.getTime() + 7 * 24 * 60 * 60 * 1000,
  );

  // console.log({ firstAdvent, secondAdvent, thirdAdvent, fourthAdvent });
  return { firstAdvent, secondAdvent, thirdAdvent, fourthAdvent };
};
interface FlipFlapSquareProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  length: number;
  text: string;
  yesFlipFlap?: boolean;
}
const FlipFlapSquare: React.FC<FlipFlapSquareProps> = ({
  value,
  length,
  text,
  yesFlipFlap = true,
  ...props
}) => {
  const stripeStyle = {
    backgroundImage: `repeating-linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.1) 10px,
      transparent 10px,
      transparent 20px
    )`,
  };
  return (
    // The outer box remains the same
    <div
      // className="relative flex flex-col items-center justify-center p-6 w-64 h-48 bg-red-800 bg-opacity-80 rounded-lg shadow-xl border-2 border-yellow-400 overflow-hidden"
      // className={cn(
      //   'relative flex flex-col items-center justify-center p-6 w-64 h-48 bg-red-800 bg-opacity-80 rounded-lg shadow-xl border-2 border-yellow-400 overflow-hidden',
      //   props.className || '',
      // )}
      className={`relative flex flex-col items-center justify-center p-6 w-64 h-48 rounded-lg shadow-xl border-2 overflow-hidden ${props.className}`}
      style={stripeStyle}
    >
      {/* Ribbons stay the same */}
      <div className={`${ribbonVerticalStyle} left-1/2 -translate-x-1/2`}></div>
      <div
        className={`${ribbonHorizontalStyle} top-1/2 -translate-y-1/2`}
      ></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full shadow-md z-[5]"></div>{' '}
      {/* Simple circle as a 'knot' */}
      {/* --- ADD CENTERING CLASSES HERE --- */}
      <div className="relative z-10 flex flex-col items-center space-y-4">
        {yesFlipFlap ? (
          <FlapDisplay
            chars={` 9876543210`}
            length={length}
            value={value}
            className="text-5xl flip"
          />
        ) : (
          // <div className="text-5xl font-mono font-bold">{value}</div>
          <p
            className="text-5xl font-mono font-bold text-shadow-lg"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
          >
            {value}
          </p>
        )}
        <p
          className="text-2xl text-center text-blue-800 font-bold bg-yellow-300 px-2 py-1 rounded shadow-lg bg-opacity-10"
          style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.5)' }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};
function Timer() {
  const currentYear = new Date().getFullYear();
  const timeUntil = useTimeUntil(
    new Date(`${currentYear}-12-24T17:00:00.000Z`),
  );
  // const timeUntil = useTimeUntil(new Date('2023-12-24T17:00:00.000Z'));k

  const [firstAdvent, setFirstAdvent] = useState<Date>(
    // getAdvents().firstAdvent,
    new Date('2023-11-14T02:41:00.000Z'),
  );
  const [secondAdvent, setSecondAdvent] = useState<Date>(
    // getAdvents().secondAdvent,
    new Date('2023-11-14T02:42:00.000Z'),
  );
  const [thirdAdvent, setThirdAdvent] = useState<Date>(
    getAdvents().thirdAdvent,
  );
  const [fourthAdvent, setFourthAdvent] = useState<Date>(
    getAdvents().fourthAdvent,
  );
  const { isTriggered: isFirstAdvent } = useDate(getAdvents().firstAdvent);
  const { isTriggered: isSecondAdvent } = useDate(getAdvents().secondAdvent);
  const { isTriggered: isThirdAdvent } = useDate(getAdvents().thirdAdvent);
  const { isTriggered: isFourthAdvent } = useDate(getAdvents().fourthAdvent);
  // progress from firstAdvent to secondAdvent from 0 to 1, use Date.now() to get current time timeUntil.now is new Date()

  const { stringifiedTime } = timeUntil;
  return (
    <>
      <div className="flex flex-row items-center justify-center space-x-3">
        {/* <div className="flex flex-col items-center justify-center space-y-4 rounded-full border-2 p-6 w-96 h-96 bg-red-600 bg-opacity-60"> */}

        <div className="grid grid-cols-2 gap-6">
          <FlipFlapSquare
            value={timeUntil.stringifiedTime.days}
            length={2}
            text="Dager"
            yesFlipFlap={false}
            className="bg-red-800 border-yellow-400 bg-opacity-70"
          />

          <FlipFlapSquare
            value={timeUntil.stringifiedTime.hours}
            length={2}
            text="Timer"
            yesFlipFlap={false}
            className="bg-green-800 border-yellow-400 bg-opacity-70"
          />

          <FlipFlapSquare
            value={timeUntil.stringifiedTime.minutes}
            length={2}
            text="Minutter"
            yesFlipFlap={false}
            className="bg-red-800 border-yellow-400 bg-opacity-70"
          />

          <FlipFlapSquare
            value={timeUntil.stringifiedTime.seconds}
            length={2}
            text="Sekunder"
            yesFlipFlap={false}
            className="bg-green-800 border-yellow-400 bg-opacity-70"
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
    </>
  );
}

export default Timer;
