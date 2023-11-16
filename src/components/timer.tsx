import React, { useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { FlapDisplay, Presets } from 'react-split-flap-effect';
import useTimeUntil from '../hooks/use-time-until';
import './timer.css';
import { useDate } from '../hooks/use-cron';
import { FlatProgressBar } from './progress';
import WindowsLoading from './windows-loading';
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
function Timer() {
  const timeUntil = useTimeUntil(new Date('2023-12-24T17:00:00.000Z'));
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
      <div className="flex flex-row items-center justify-center space-x-4">
        {/* <div className="flex flex-col items-center justify-center space-y-4 rounded-full border-2 p-6 w-96 h-96 bg-red-600 bg-opacity-60"> */}

        <div
          className={`flex flex-col items-center justify-center space-y-4 rounded-full border-2 p-6 w-96 h-96 bg-red-600 bg-opacity-60 ${
            // isFirstAdvent ? 'bg-green-600' : ''
            'test'
          }`}
        >
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
            value={timeUntil.days === 1 ? 'Dag' : 'Dager'}
            className="text-4xl"
          />
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 rounded-full border-2 p-6 w-96 h-96 bg-red-600 bg-opacity-60">
          <FlapDisplay
            chars={` 9876543210`}
            length={2}
            // value={`Hello World!`}
            value={timeUntil.stringifiedTime.hours}
            className="text-4xl text-purple-50"
          />
          <FlapDisplay
            chars={Presets.ALPHANUM}
            length={5}
            value={timeUntil.hours === 1 ? 'Time' : 'Timer'}
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
            value={timeUntil.minutes === 1 ? 'minutt' : 'minutter'}
            className="text-4xl"
          />
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 rounded-full border-2 p-6 w-96 h-96 bg-red-600 bg-opacity-60">
          <FlapDisplay
            chars={` 9876543210`}
            length={2}
            // value={`Hello World!`}
            value={timeUntil.seconds.toString()}
            className="text-4xl"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          />
          {/* <h1 className="text-4xl">Sekunder</h1> */}
          <FlapDisplay
            chars={Presets.ALPHANUM}
            length={8}
            value={timeUntil.seconds === 1 ? 'Sekund' : 'Sekunder'}
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
    </>
  );
}

export default Timer;
