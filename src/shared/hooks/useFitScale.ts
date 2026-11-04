import { useSyncExternalStore } from 'react';

const subscribe = (onChange: () => void) => {
  window.addEventListener('resize', onChange);
  return () => window.removeEventListener('resize', onChange);
};

/**
 * Во сколько раз уменьшить блок размером width × height, чтобы он целиком поместился в окно.
 * Больше 1 не увеличивает.
 */
export function useFitScale(width: number, height: number): number {
  return useSyncExternalStore(subscribe, () => Math.min(1, window.innerWidth / width, window.innerHeight / height));
}
