import React, { useEffect, useState, useReducer } from 'react';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { FlapDisplay, Presets } from 'react-split-flap-effect';

import Timer from './components/timer';
import { useCron } from './hooks/use-cron';
import { SnowOverlay } from './components/snow-overlay';

function App() {
  const [word, setWord] = useState('God jul!  ');
  // const [words, setWords] = useState(['God jul!']);
  const [wordLength, setWordLength] = useState(10);
  const [marqueeIndex, setMarqueeIndex] = useState(0);
  const [now, setNow] = useState(new Date());
  const [backgroundImage, setBackgroundImage] = useState('');
  const nextCron = useCron(
    '0 * * * *',
    async () => {
      console.log('every 10 seconds');
      const res = await fetch('/get-random-image').then((res) => {
        if (!res.ok) {
          throw new Error('Could not fetch image');
        }
        // the response is a file
        return res.blob();
      });

      setBackgroundImage(URL.createObjectURL(res));
    },
    {
      triggerInstantly: true,
    },
  );
  const nextC = useCron('00 11 * * *', () => {
    setWord((prev) => {
      prev = 'God lunsj!';
      return prev;
    });
    setTimeout(() => {
      setWord((prev) => {
        prev = 'God jul!';
        return prev;
      });
    }, 1000 * 60 * 10);
  });

  const nextC2 = useCron('*/1 * * * * *', () => {
    setWord((prev) => {
      if (prev === 'God lunsj!') {
        return 'God lunsj!';
      }
      const word = 'God Jul!  ';
      const totalLength = 10;
      // move the words to the left

      const newWord =
        word.slice(marqueeIndex, totalLength) + word.slice(0, marqueeIndex);

      if (marqueeIndex === totalLength) {
        setMarqueeIndex(0);
      }

      setMarqueeIndex((prev) => {
        return prev + 1;
      });
      return newWord;
      // const randomIndex = Math.floor(Math.random() * words.length);
      // return words[randomIndex];
    });
  });

  // const timeUntil = useTimeUntil(targetDate);
  // useEffect(() => {
  //   setTargetDate((prev) => {
  //     const d = new Date(prev);
  //     d.setDate(d.getDay() + 1);
  //     return d;
  //   });
  // }, []);
  // center the stuff IT HAS TAILWIND SO YOU CAN DO IT

  return (
    <>
      <div
        // make sure the entire image is shown so dont crop it
        className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white  bg-center bg-no-repeat bg-contain"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          // backgroundSize: 'cover',
          // backgroundPosition: 'center',
          // backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row">
            <div className="flex flex-col items-center justify-center space-y-4 space-x-4">
              <div className="flex flex-row items-center justify-center space-x-4 bg-gray-900 bg-opacity-60 rounded-sm  p-6">
                <h1 className="text-4xl">Nedtelling til juleaften</h1>
              </div>
              <Timer />
              <div className="flex flex-row items-center justify-center space-x-4 bg-gray-900 bg-opacity-60 rounded-sm  p-6">
                <FlapDisplay
                  // chars={[...Presets.ALPHANUM].join('')}
                  chars={`${Presets.ALPHANUM}!:!.`}
                  length={wordLength}
                  value={word}
                  className="text-4xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <SnowOverlay />
    </>
  );
}

export default App;
