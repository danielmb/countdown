import React, { useEffect, useState, useReducer } from 'react';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { useLocalStorage, useInterval } from 'usehooks-ts';
import { useHotkeys } from 'react-hotkeys-hook';
import DateTimePicker from 'react-datetime-picker';
import useTimeUntil from './hooks/use-time-until';
import { getProgressDate } from './lib/get-progress-date';
import MainProgressBar, { FlatProgressBar } from './components/progress';
import SingleSplitFlap, { SplitFlap } from './components/flap-display';
import { createLetters, numbers } from './lib/flip-flap-letters';
import SplitFlapDisplay from 'react-split-flap-display';
// @ts-ignore
import { FlapDisplay, Presets } from 'react-split-flap-effect';

function App() {
  const [targetDate, setTargetDate] = useState(new Date());
  const [word, setWord] = useState('');
  const [now, setNow] = useState(new Date());
  // center the stuff IT HAS TAILWIND SO YOU CAN DO IT
  const letters = createLetters({
    includeAlphabet: true,
    includeNumbers: true,
  });
  useInterval(() => {
    setNow(new Date());
  }, 1);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row">
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl">Target Date</p>
            {/* Key	Type	Default	Description
background	string	'#000000'	Hex or rgb() string for the display's background
borderColor	string	'#dddddd'	Hex or rgb() string for the color of the border between characters
borderWidth	string	'1px'	Any valid CSS width value for the width of the border between characters
characterSet	Array of strings (required)	null	The array of characters for the display to flip through
characterWidth	string	'1em'	Any valid CSS width value for the width of each character. Useful with non-monospaced fonts
fontSize	string	'1em'	Any valid CSS font-size value
minLength	number	null	Minimum # of characters in the display
padDirection	string	'left'	If minLength > number of characters currently displayed, append blank characters to left or right side
step	number	200	Sets the speed (ms) of flips
textColor	string	'#dddddd'	Hex or rgb() string for color of the display characters
value	string (required)	null	The string of characters to display or flip to
withSound	boolean or string	null	Optionally load and play a sound with every flip.
Sound duration must be less than or equal to step duration.
true loads an mp3 I recorded of a single Vestaboard bit flipping */}
            <SplitFlapDisplay
              characterSet={[...letters, ':', ' ']}
              value={now.toLocaleTimeString()}
              step={1000}
              fontSize={'1em'}
              characterWidth={'1em'}
              minLength={undefined}
              padDirection={'left'}
              textColor={'#dddddd'}
              borderColor={'#dddddd'}
              borderWidth={'1px'}
              background={'#000000'}
              withSound={true}
            />
            <p className="text-2xl">VS</p>

            <FlapDisplay
              chars={Presets.ALPHANUM}
              length={10}
              value={`Hello World!`}
            />
            {/* <DateTimePicker
              onChange={(date) => setTargetDate(date as Date)}
              value={targetDate}
              disableClock={true}
              className={'text-black bg-white'}
            />
            <input
              className="text-black"
              type="text"
              value={word}
              onChange={(e) => {
                if (e.target.value.length > 10) {
                  return;
                }
                if (
                  !e.target.value
                    .split('')
                    .every((letter) => letters.includes(letter))
                ) {
                  return;
                }
                setWord(e.target.value);
              }}
            />
            <SplitFlap length={10} targetWord={word} letters={letters} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
