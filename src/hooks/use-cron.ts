// import cron from 'node-cron';
import { parseCronExpression } from 'cron-schedule';
import React, { useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import useTimeUntil, { getTimeUntil } from './use-time-until';

interface Cron {
  date: Date | null;
  isTriggered: boolean;
}
interface CronOptions {
  triggerInstantly?: boolean;
  triggerInstantlyBefore?: Date;
}

export const useCron = (
  userCron: string,
  onTrigger: () => void,
  options?: CronOptions,
) => {
  // const [cronInstance, setCronInstance] = useState<cron.ScheduledTask>();
  const [cronInstance, setCronInstance] = useState<NodeJS.Timeout>();
  const [cron, setCron] = useState<Cron>({
    // date: options?.triggerInstantly ? new Date() : null,
    date: options?.triggerInstantlyBefore
      ? options.triggerInstantlyBefore
      : options?.triggerInstantly
      ? new Date()
      : null,
    isTriggered: false,
  });
  // useEffect(() => {
  //   // check if there is a new date
  //   console.log(userCron, cron.date, cron.isTriggered);
  //   const parsedCron = parseCronExpression(userCron);
  //   const nextDate = parsedCron.getNextDate();
  //   if (nextDate.getTime() !== cron.date.getTime()) {
  //     console.log('New date detected!');
  //     setCron({ date: nextDate, isTriggered: false });
  //   }
  //   const now = new Date();
  //   if (cron.date.getTime() < now.getTime() && !cron.isTriggered) {
  //     onTrigger();
  //     setCron((prev) => ({ ...prev, isTriggered: true }));
  //   }
  //   // make sure this renders every second
  //   const timeout = setTimeout(() => {
  //     setCronInstance(timeout);
  //   }, 1000);
  //   return () => clearTimeout(timeout);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [userCron, cron.date, cron.isTriggered]);
  useInterval(() => {
    // check if there is a new date
    const parsedCron = parseCronExpression(userCron);
    const nextDate = parsedCron.getNextDate();
    if (cron.date === null) {
      setCron({ date: nextDate, isTriggered: false });
      return;
    }
    if (nextDate.getTime() !== cron.date.getTime()) {
      setCron({ date: nextDate, isTriggered: false });
    }
    const now = new Date();
    if (cron.date.getTime() < now.getTime() && !cron.isTriggered) {
      onTrigger();
      setCron((prev) => ({ ...prev, isTriggered: true }));
    }
  }, 1000);

  return cron;
};

interface DateOptions {
  date: Date;
  isTriggered: boolean;
}

export const useDate = (
  userDate: Date,
  // onTrigger: (date: DateOptions) => void,
  onTrigger?: (date: DateOptions) => void | Promise<void>,
) => {
  const [date, setDate] = useState<DateOptions>({
    date: userDate,
    isTriggered: new Date().getTime() > userDate.getTime(),
  });
  useInterval(async () => {
    const now = new Date();
    if (userDate.getTime() < now.getTime() && !date.isTriggered) {
      await onTrigger?.(date);
      setDate((prev) => ({ ...prev, isTriggered: true }));
    }
  }, 1000);

  return { ...date, setDate };
};
