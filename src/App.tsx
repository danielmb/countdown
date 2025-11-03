import React, { useEffect, useState, useMemo } from 'react';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { motion } from 'framer-motion';

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import './App.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { FlapDisplay, Presets } from 'react-split-flap-effect';

import Timer from './components/timer';
import { useCron, useDate } from './hooks/use-cron';
import { useIsCurrentlyBetweenTimes } from './hooks/use-time';
import { Snow } from './components/snow-overlay2';
import santa from './assets/santa.png'; // Make sure you import Santa
import { useKeyPress } from '@uidotdev/usehooks';
import { Weather } from './components/weather';
import { useAutoReload } from './hooks/use-auto-reload';
// use key presses
const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function App() {
  // Auto-reload when server restarts (checks every 10 seconds)
  useAutoReload(10000);

  // const [words, setWords] = useState(['God jul!']);
  const [isSantaVisible, setIsSantaVisible] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);
  useKeyPress('s', () => {
    setIsSantaVisible((prev) => !prev);
  });

  useKeyPress('d', () => {
    setIsDevelopment((prev) => !prev);
  });

  useEffect(() => {
    let santaTimeoutId: NodeJS.Timeout;

    const scheduleSanta = () => {
      // Set a random time for Santa's next appearance (e.g., between 20 and 40 minutes)
      const randomDelay = randomBetween(50_00_000, 90_00_000);

      santaTimeoutId = setTimeout(() => {
        // Santa appears
        setIsSantaVisible(true);

        // Set a timeout for how long he stays visible (e.g., 10 seconds)
        setTimeout(() => {
          // Santa disappears
          setIsSantaVisible(false);
          // Schedule the next appearance
          scheduleSanta();
        }, randomBetween(15_000, 30_000)); // Santa stays for 15 to 30 seconds
      }, randomDelay);
    };

    // Start the first schedule
    scheduleSanta();

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(santaTimeoutId);
  }, []); // Empty dependency array ensures this runs only once

  const [wordLength, setWordLength] = useState(10);
  const [marqueeIndex, setMarqueeIndex] = useState(0);
  const [now, setNow] = useState(new Date());
  const [backgroundImage, setBackgroundImage] = useState('');
  const [backgroundVideo, setBackgroundVideo] = useState('');
  const [windSpeed, setWindSpeed] = useState(0);
  const [snowfallMmPerHour, setSnowfallMmPerHour] = useState<
    number | undefined
  >(undefined);
  useEffect(() => {
    console.log('Snowfall mm/hr changed: ', snowfallMmPerHour);
  }, [snowfallMmPerHour]);
  const [videoIsPlaying, setVideoIsPlaying] = useState(false);
  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (backgroundImage) {
        URL.revokeObjectURL(backgroundImage);
      }
      if (backgroundVideo) {
        URL.revokeObjectURL(backgroundVideo);
      }
    };
  }, [backgroundImage, backgroundVideo]);
  const { date, isTriggered, reschedule } = useCron(
    '0 * * * *',
    async () => {
      const res = await fetch('/get-random-image', {
        headers: {
          // 'Content-Type': 'application/json',
          // text
          'Content-Type': 'text/plain',
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Could not fetch image');
        }
        // the response is a file
        return res.text();
      });
      const url = res;
      // Handle different media types
      setVideoIsPlaying(false);
      if (res.endsWith('.mp4')) {
        // const objUrl = URL.createObjectURL(res);
        const objUrl = url;
        setBackgroundVideo(objUrl);
        setBackgroundImage(''); // Clear image when video is set
        console.log('Video URL:', objUrl);
        return;
      }

      // Handle image files
      // setBackgroundImage(URL.createObjectURL(res));
      console.log('Image URL:', url);
      setBackgroundImage(url);
      setBackgroundVideo(''); // Clear video when image is set
    },
    {
      triggerInstantly: true,
    },
  );

  const isLunch = useIsCurrentlyBetweenTimes('11:00:00', '11:30:00');
  const isLunchExtended = useIsCurrentlyBetweenTimes('11:00:00', '11:35:00');

  // 11-14 2:35 am

  const word = useMemo(() => {
    if (isLunch) {
      return 'God Lunsj!';
    }
    return 'God Jul!';
  }, [isLunch]);
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
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white overflow-hidden">
        {/* Background Video */}
        {backgroundVideo && (
          <video
            className="absolute top-0 left-0 w-full h-full  z-0"
            src={backgroundVideo}
            // loop
            muted
            playsInline
            // on init
            onCanPlay={(videoEvent) => {
              setTimeout(() => {
                (videoEvent.target as HTMLVideoElement).play();
              }, randomBetween(0, 60_000)); // Play after 0 to 10 seconds
            }}
            // on end
            onEnded={(videoEvent) => {
              // If a specific video ended, allow scheduling of a new background media fetch
              console.log('Video ended:', backgroundVideo);
              if (
                backgroundVideo?.includes(
                  'Santa_Flying_Over_Building_Video.mp4',
                )
              ) {
                // kick the scheduler to compute the next run from "now"
                reschedule?.();
              }
              setTimeout(() => {
                (videoEvent.target as HTMLVideoElement).play();
              }, randomBetween(600_000, 1_200_000)); // Replay after 10 to 20 minutes
            }}
            onPlay={(e) => {
              setVideoIsPlaying(true);
            }}
            onPause={(e) => {
              setVideoIsPlaying(false);
            }}
          />
        )}
        {/* Background Image */}
        {backgroundImage && !backgroundVideo && (
          <div
            className="absolute top-0 left-0 w-full h-full bg-center bg-no-repeat bg-contain z-0"
            style={{
              backgroundImage: `url(${backgroundImage})`,
            }}
          />
        )}
        {/* Content overlay */}
        {!videoIsPlaying && (
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-row">
                <div className="flex flex-col items-center justify-center space-y-4 space-x-4">
                  <div className="flex flex-row items-center justify-center space-x-4 bg-gray-900 bg-opacity-60 rounded-sm  p-6">
                    <h1 className="text-4xl">Nedtelling til julaften</h1>
                  </div>
                  {/* {!isLunchExtended && <CountDownLunch />} */}
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
                  <Weather
                    setWindSpeed={setWindSpeed}
                    onSnowfallChange={setSnowfallMmPerHour}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Place images freely */}

      <motion.img
        src={santa}
        alt="Peeking Santa"
        className="fixed bottom-0 right-0 w-48 h-auto z-10"
        initial={{ y: 340 }} // Start fully hidden below the screen
        animate={{ y: isSantaVisible ? 0 : 340 }} // Animate to 0 (at the bottom) or back to 200 (hidden)
        transition={{ duration: 3, ease: 'easeOut' }} // Controls the speed of him popping up and down
      />

      {snowfallMmPerHour !== undefined && (
        <Snow
          windSpeed={windSpeed}
          onWindSpeedChange={setWindSpeed}
          intensityMmPerHour={snowfallMmPerHour}
          showSpeedControl={isDevelopment}
        />
      )}
    </>
  );
}

export default App;
