import { create } from 'zustand';
import type { TooltipContent } from './types';

type TooltipState = {
  content: TooltipContent | null;
  show: (content: TooltipContent) => void;
  hide: () => void;
};

export const useTooltipStore = create<TooltipState>((set) => ({
  content: null,
  show: (content) => set({ content }),
  hide: () => set({ content: null }),
}));
