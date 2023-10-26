// take in 3 arguments
// 1. current time
// 2. start time
// 3. end time

interface ProgressDate {
  current: Date;
  start: Date;
  end: Date;
}
interface ProgressDateOptions {
  reverse?: boolean; //
}
export const getProgressDate = (
  progressInput: ProgressDate,
  options: ProgressDateOptions,
) => {
  const { current, start, end } = progressInput;
  const { reverse } = options;

  const currentTimestamp = current.getTime();
  const startTimestamp = start.getTime();
  const endTimestamp = end.getTime();

  const total = endTimestamp - startTimestamp;
  const remaining = endTimestamp - currentTimestamp;
  const elapsed = total - remaining;
  const progress = elapsed / total;
  const progressPercent = progress * 100;

  const progressDate = new Date(total * progress + startTimestamp);

  return {
    progress,
    progressPercent,
    progressDate,
  };
};
