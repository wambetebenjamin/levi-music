"use client";

import { create } from "zustand";
import type { Track } from "@/lib/types";

interface PlayerState {
  queue: Track[];
  currentIndex: number;
  current: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  hasStarted: boolean;
  playTrack: (track: Track, queue?: Track[]) => void;
  toggle: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (value: number) => void;
  setProgress: (value: number) => void;
  setDuration: (value: number) => void;
  close: () => void;
}

export const usePlayer = create<PlayerState>((set, get) => ({
  queue: [],
  currentIndex: 0,
  current: null,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  hasStarted: false,
  playTrack: (track, queue) => {
    const list = queue && queue.length ? queue : [track];
    const index = Math.max(
      0,
      list.findIndex((t) => t.id === track.id),
    );
    set({
      queue: list,
      currentIndex: index,
      current: track,
      isPlaying: true,
      progress: 0,
      duration: 0,
      hasStarted: true,
    });
  },
  toggle: () => {
    const { current } = get();
    if (!current) return;
    set((state) => ({ isPlaying: !state.isPlaying, hasStarted: true }));
  },
  pause: () => set({ isPlaying: false }),
  next: () => {
    const { queue, currentIndex } = get();
    if (!queue.length) return;
    const index = (currentIndex + 1) % queue.length;
    set({
      currentIndex: index,
      current: queue[index],
      progress: 0,
      duration: 0,
      isPlaying: true,
      hasStarted: true,
    });
  },
  previous: () => {
    const { queue, currentIndex, progress } = get();
    if (!queue.length) return;
    if (progress > 4) {
      set({ progress: 0 });
      return;
    }
    const index = (currentIndex - 1 + queue.length) % queue.length;
    set({
      currentIndex: index,
      current: queue[index],
      progress: 0,
      duration: 0,
      isPlaying: true,
      hasStarted: true,
    });
  },
  setVolume: (value) => set({ volume: value }),
  setProgress: (value) => set({ progress: value }),
  setDuration: (value) => set({ duration: value }),
  close: () => set({ current: null, isPlaying: false, queue: [], progress: 0, duration: 0 }),
}));
