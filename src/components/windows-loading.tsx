import React from 'react';
import 'xp.css/dist/XP.css';
interface WindowsLoadingProps {
  progress: number; // Should be a number between 0 and 1
  bodyText?: string;
  titleText?: string;
  remainingTime?: string;
}

function WindowsLoading({
  progress,
  bodyText,
  remainingTime,
  titleText,
}: WindowsLoadingProps) {
  return (
    <div className="h-24 w-72 justify-center align-middle flex text-black">
      <div className="window w-60">
        <div className="title-bar p-2">
          <div className="title-bar-text">{titleText}</div>
          <div className="title-bar-controls">
            {/* <button aria-label="Minimize" /> */}
            {/* <button aria-label="Maximize" disabled className="disabled " /> */}
            {/* <button aria-label="Close" className="h-6" /> */}
          </div>
        </div>

        <div className="window-body">
          {bodyText}
          <div className="p-1 flex space-x-4">
            <progress value={progress} max="1" />
            <button>Avbryt</button>
          </div>
          <div className="pl-1 flex space-x-4">
            <p>{remainingTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WindowsLoading;
