import { motion, useSpring } from 'framer-motion';
import './progress.css';
interface ProgressProps {
  progress: number; // Should be a number between 0 and 1
  reverse?: boolean;
}
const MainProgressBar = ({ progress, reverse }: ProgressProps) => {
  const newProgress = reverse ? 1 - progress : progress;
  return (
    <div className="progress">
      <motion.div
        className="progress__bar"
        initial={{ width: 0 }}
        animate={{ width: `${newProgress * 100}%` }}
      />
    </div>
  );
};

export const FlatProgressBar = ({ progress, reverse }: ProgressProps) => {
  const newProgress = reverse ? 1 - progress : progress;
  return (
    <div className="progress_flat">
      <motion.div
        className="progress__bar_flat"
        initial={{ width: 0 }}
        animate={{ width: `${newProgress * 100}%`, height: '100%' }}
        // set time
        transition={{ duration: 0.001 }}
        // style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
};

export default MainProgressBar;
