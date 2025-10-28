import { parseCronExpression } from 'cron-schedule';
import React, { useEffect, useMemo, useRef, useState } from 'react';

type TimeoutHandle = ReturnType<typeof setTimeout>;

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
  onTrigger: () => void | Promise<void>,
  options?: CronOptions,
) => {
  const [cron, setCron] = useState<Cron>({
    // preserve existing behavior for initial state
    date: options?.triggerInstantlyBefore
      ? options.triggerInstantlyBefore
      : null,
    isTriggered: false,
  });

  const [error, setError] = useState<Error | null>(null);
  const timerRef = useRef<TimeoutHandle | null>(null);
  const runningRef = useRef(false);
  const scheduleRef = useRef<ReturnType<typeof parseCronExpression> | null>(
    null,
  );
  const onTriggerRef = useRef(onTrigger);
  onTriggerRef.current = onTrigger;

  // Parse cron only when expression changes (no setState in render)
  const parseResult = useMemo(() => {
    try {
      return {
        schedule: parseCronExpression(userCron),
        error: null as Error | null,
      };
    } catch (e) {
      return {
        schedule: null as ReturnType<typeof parseCronExpression> | null,
        error: e as Error,
      };
    }
  }, [userCron]);

  const schedule = parseResult.schedule;

  // Reflect parse results via effects to avoid render-time setState
  useEffect(() => {
    setError(parseResult.error);
    scheduleRef.current = parseResult.schedule;
  }, [parseResult]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const scheduleNext = (from: Date = new Date()) => {
    if (!scheduleRef.current) return;
    const next = scheduleRef.current.getNextDate(from);
    setCron({ date: next, isTriggered: false });
    const delay = Math.max(0, next.getTime() - Date.now());
    timerRef.current = setTimeout(runOnce, delay);
  };

  const runOnce = async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    try {
      await onTriggerRef.current();
      // mark this occurrence as triggered until next date is computed
      setCron((prev) => ({ ...prev, isTriggered: true }));
    } finally {
      runningRef.current = false;
      scheduleNext(new Date());
    }
  };

  useEffect(() => {
    clearTimer();
    if (!scheduleRef.current) return;

    // If requested, trigger immediately on mount or when expression changes
    if (options?.triggerInstantly) {
      Promise.resolve(onTriggerRef.current())
        .then(() => setCron((prev) => ({ ...prev, isTriggered: true })))
        .finally(() => scheduleNext(new Date()));
      return () => clearTimer();
    }

    const firstNext = scheduleRef.current.getNextDate(new Date());
    setCron({ date: firstNext, isTriggered: false });
    const delay = Math.max(0, firstNext.getTime() - Date.now());
    timerRef.current = setTimeout(runOnce, delay);

    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule, options?.triggerInstantly]);

  const cancel = () => clearTimer();
  const reschedule = () => {
    clearTimer();
    scheduleNext(new Date());
  };

  return { ...cron, error, cancel, reschedule };
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
    isTriggered: Date.now() > userDate.getTime(),
  });

  const timerRef = useRef<TimeoutHandle | null>(null);
  const onTriggerRef = useRef(onTrigger);
  onTriggerRef.current = onTrigger;

  // Convert Date to timestamp to avoid object reference issues
  const userDateTimestamp = userDate.getTime();

  useEffect(() => {
    // Recreate the Date from the timestamp
    const targetDate = new Date(userDateTimestamp);
    const initialTriggered = Date.now() > userDateTimestamp;

    // Only update state if the date actually changed
    setDate((prev) => {
      if (
        prev.date.getTime() !== userDateTimestamp ||
        prev.isTriggered !== initialTriggered
      ) {
        return { date: targetDate, isTriggered: initialTriggered };
      }
      return prev;
    });

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const ms = userDateTimestamp - Date.now();
    if (ms <= 0) {
      if (!initialTriggered) {
        Promise.resolve(
          onTriggerRef.current?.({ date: targetDate, isTriggered: false }),
        ).finally(() => setDate((prev) => ({ ...prev, isTriggered: true })));
      }
      return;
    }

    timerRef.current = setTimeout(() => {
      Promise.resolve(
        onTriggerRef.current?.({ date: targetDate, isTriggered: false }),
      ).finally(() => setDate((prev) => ({ ...prev, isTriggered: true })));
    }, ms);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [userDateTimestamp]);

  return { ...date, setDate };
};
