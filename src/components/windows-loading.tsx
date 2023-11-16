import React from 'react';
import 'xp.css/dist/XP.css';
interface WindowsLoadingProps {
  progress: number; // Should be a number between 0 and 1
}

function WindowsLoading({ progress }: WindowsLoadingProps) {
  return (
    <div className="h-24 w-72 justify-center align-middle flex text-black">
      <div className="window w-60">
        <div className="title-bar p-2">
          <div className="title-bar-text">Laster ned..</div>
          <div className="title-bar-controls">
            {/* <button aria-label="Minimize" /> */}
            {/* <button aria-label="Maximize" disabled className="disabled " /> */}
            {/* <button aria-label="Close" className="h-6" /> */}
          </div>
        </div>

        <div className="window-body">Laster ned julaften ... 🎄🎄🎄🎄</div>
        <div className="p-2 flex space-x-4">
          <progress value={progress} max="1" />
          <button>Avbryt</button>
        </div>
      </div>
    </div>
  );
}

export default WindowsLoading;
