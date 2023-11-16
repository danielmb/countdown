import { useState } from 'react';
import { useInterval } from 'usehooks-ts';

type Clock =
  | `${number}:${number}:${number}`
  | `${number}:${number}`
  | `${number}`
  | `${number}:${number}:${number}.${number}`;

const clockToDate = (clock: Clock, date = new Date()) => {
  const dateParts = clock.split(/[:.]/);
  date.setHours(parseInt(dateParts[0]));
  dateParts[1] && date.setMinutes(parseInt(dateParts[1]));
  dateParts[2] && date.setSeconds(parseInt(dateParts[2]));
  dateParts[3] && date.setMilliseconds(parseInt(dateParts[3]));
  return date;
};
const isBetween = (startTime: Clock, endTime: Clock, now = new Date()) => {
  const start = new Date();
  const end = new Date();
  const startDate = clockToDate(startTime, start);
  const endDate = clockToDate(endTime, end);
  if (startDate.getTime() > endDate.getTime()) {
    end.setDate(end.getDate() + 1);
  }
  return (
    now.getTime() > startDate.getTime() && now.getTime() < endDate.getTime()
  );
};

export const useIsCurrentlyBetweenTimes = (
  startTime: Clock,
  endTime: Clock,
) => {
  const [isBetweenState, setIsBetweenState] = useState(
    isBetween(startTime, endTime),
  );
  useInterval(() => {
    setIsBetweenState(isBetween(startTime, endTime));
  }, 1000);
  return isBetweenState;
};
