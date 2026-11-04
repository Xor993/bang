import { useCallback, useRef } from 'react';

const DEFAULT_DELAY_MS = 600;

export const useLongHover = (
  onActivate: () => void,
  onDeactivate: () => void,
  delayMs = DEFAULT_DELAY_MS,
) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onMouseEnter = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(onActivate, delayMs);
  }, [clearTimer, delayMs, onActivate]);

  const onMouseLeave = useCallback(() => {
    clearTimer();
    onDeactivate();
  }, [clearTimer, onDeactivate]);

  return { onMouseEnter, onMouseLeave };
};
