"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { normalizeTranscriptToKeyframes } from "./parsers/replayParser.js";

/**
 * useSessionReplay Hook
 * Manages keyframe sequence, playback timer loop, seeking, and speed.
 */
export function useSessionReplay(initialSessionId = null) {
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sessionData, setSessionData] = useState({
    sessionInfo: {},
    keyframes: [],
    totalElapsedSeconds: 0,
    totalTokens: 0,
    totalCost: 0,
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(2); // Default 2x speed for good pacing

  const animFrameRef = useRef(null);
  const lastTickRef = useRef(null);

  // Fetch and normalize session transcript
  const loadSession = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setIsPlaying(false);
    setCurrentStepIndex(0);

    try {
      const res = await fetch(`/api/sessions/${encodeURIComponent(id)}/transcript`);
      if (!res.ok) {
        throw new Error(`Failed to load session transcript: HTTP ${res.status}`);
      }
      const data = await res.json();
      const normalized = normalizeTranscriptToKeyframes(data);
      setSessionData(normalized);
      setSessionId(id);
      setCurrentStepIndex(0);
    } catch (err) {
      console.error("[useSessionReplay] Load error:", err);
      setError(err.message || "Không thể tải dữ liệu phiên làm việc");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load if initialSessionId is provided
  useEffect(() => {
    if (initialSessionId) {
      loadSession(initialSessionId);
    }
  }, [initialSessionId, loadSession]);

  const { keyframes, totalElapsedSeconds, sessionInfo, totalTokens, totalCost } = sessionData;
  const totalSteps = keyframes.length;

  const currentKeyframe = useMemo(() => {
    if (keyframes.length === 0) return null;
    const idx = Math.min(Math.max(0, currentStepIndex), keyframes.length - 1);
    return keyframes[idx];
  }, [keyframes, currentStepIndex]);

  const currentTime = currentKeyframe ? currentKeyframe.elapsedSeconds : 0;
  const progress = totalElapsedSeconds > 0 ? currentTime / totalElapsedSeconds : 0;

  // Step Controls
  const seekToStep = useCallback((index) => {
    setCurrentStepIndex((prev) => {
      const target = Math.min(Math.max(0, index), totalSteps - 1);
      return target;
    });
  }, [totalSteps]);

  const seekToProgress = useCallback((ratio) => {
    if (keyframes.length === 0) return;
    const clampedRatio = Math.min(Math.max(0, ratio), 1);
    const targetSeconds = clampedRatio * totalElapsedSeconds;

    // Find closest keyframe to targetSeconds
    let closestIdx = 0;
    let minDiff = Infinity;
    keyframes.forEach((kf, idx) => {
      const diff = Math.abs(kf.elapsedSeconds - targetSeconds);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    seekToStep(closestIdx);
  }, [keyframes, totalElapsedSeconds, seekToStep]);

  const stepForward = useCallback(() => {
    seekToStep(currentStepIndex + 1);
  }, [currentStepIndex, seekToStep]);

  const stepBackward = useCallback(() => {
    seekToStep(currentStepIndex - 1);
  }, [currentStepIndex, seekToStep]);

  const play = useCallback(() => {
    if (currentStepIndex >= totalSteps - 1) {
      // If at end, loop back to start
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
    lastTickRef.current = performance.now();
  }, [currentStepIndex, totalSteps]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const reset = useCallback(() => {
    pause();
    setCurrentStepIndex(0);
  }, [pause]);

  // Main playback loop
  useEffect(() => {
    if (!isPlaying || keyframes.length === 0) return;

    let accumulatedTime = 0;
    // Step duration in real-time milliseconds (scaled by playbackSpeed)
    const baseStepDuration = 1200 / playbackSpeed; // ~1.2s per step at 1x

    const loop = (timestamp) => {
      if (!lastTickRef.current) lastTickRef.current = timestamp;
      const delta = timestamp - lastTickRef.current;
      lastTickRef.current = timestamp;

      accumulatedTime += delta;

      if (accumulatedTime >= baseStepDuration) {
        accumulatedTime = 0;
        setCurrentStepIndex((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    lastTickRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, keyframes.length, totalSteps, playbackSpeed]);

  return {
    sessionId,
    loading,
    error,
    sessionInfo,
    keyframes,
    totalSteps,
    currentStepIndex,
    currentKeyframe,
    currentTime,
    totalElapsedSeconds,
    progress,
    isPlaying,
    playbackSpeed,
    totalTokens,
    totalCost,

    // Actions
    loadSession,
    play,
    pause,
    togglePlay,
    seekToStep,
    seekToProgress,
    stepForward,
    stepBackward,
    setPlaybackSpeed,
    reset,
  };
}
