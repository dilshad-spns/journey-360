import { useEffect, useRef, useState, useCallback } from "react";

interface UseVoiceActivityDetectionOptions {
  threshold?: number; // Volume threshold for voice detection (0-100)
  silenceDuration?: number; // Duration of silence before stopping (ms)
  minSpeechDuration?: number; // Minimum speech duration to consider valid (ms)
  sampleRate?: number; // Audio sample rate
  fftSize?: number; // FFT size for frequency analysis
}

interface VoiceActivityDetectionState {
  isActive: boolean;
  isSpeaking: boolean;
  volume: number;
  duration: number;
  error: string | null;
}

export function useVoiceActivityDetection(
  isRecording: boolean,
  options: UseVoiceActivityDetectionOptions = {}
) {
  const {
    threshold = 30,
    silenceDuration = 2000,
    minSpeechDuration = 500,
    sampleRate = 16000,
    fftSize = 256,
  } = options;

  const [state, setState] = useState<VoiceActivityDetectionState>({
    isActive: false,
    isSpeaking: false,
    volume: 0,
    duration: 0,
    error: null,
  });

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechStartTimeRef = useRef<number | null>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    speechStartTimeRef.current = null;

    setState((prev) => ({
      ...prev,
      isActive: false,
      isSpeaking: false,
      volume: 0,
      duration: 0,
    }));
  }, []);

  const calculateVolume = useCallback(() => {
    if (!analyserRef.current) return 0;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate RMS (Root Mean Square) volume
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / bufferLength);

    // Convert to percentage (0-100)
    return Math.round((rms / 255) * 100);
  }, []);

  const analyzeAudio = useCallback(() => {
    if (!isRecording || !analyserRef.current) return;

    const volume = calculateVolume();
    const isSpeaking = volume > threshold;

    setState((prev) => ({ ...prev, volume }));

    if (isSpeaking) {
      // Voice detected
      if (!state.isSpeaking) {
        // Start of speech
        speechStartTimeRef.current = Date.now();
        setState((prev) => ({ ...prev, isSpeaking: true }));

        // Start duration timer
        if (durationTimerRef.current) {
          clearInterval(durationTimerRef.current);
        }
        durationTimerRef.current = setInterval(() => {
          if (speechStartTimeRef.current) {
            const duration = Date.now() - speechStartTimeRef.current;
            setState((prev) => ({ ...prev, duration }));
          }
        }, 100);
      }

      // Clear silence timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    } else {
      // No voice detected
      if (state.isSpeaking) {
        // Start silence timer
        if (!silenceTimerRef.current) {
          silenceTimerRef.current = setTimeout(() => {
            // Check if speech duration meets minimum requirement
            const speechDuration = speechStartTimeRef.current
              ? Date.now() - speechStartTimeRef.current
              : 0;

            if (speechDuration >= minSpeechDuration) {
              setState((prev) => ({
                ...prev,
                isSpeaking: false,
                duration: speechDuration,
              }));
            } else {
              // Speech was too short, reset
              setState((prev) => ({
                ...prev,
                isSpeaking: false,
                duration: 0,
              }));
            }

            speechStartTimeRef.current = null;

            if (durationTimerRef.current) {
              clearInterval(durationTimerRef.current);
              durationTimerRef.current = null;
            }
          }, silenceDuration);
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, [
    isRecording,
    threshold,
    silenceDuration,
    minSpeechDuration,
    state.isSpeaking,
    calculateVolume,
  ]);

  const initializeAudio = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null }));

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;

      // Create audio context
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)({
        sampleRate,
      });
      audioContextRef.current = audioContext;

      // Create analyser
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = 0.3;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyserRef.current = analyser;

      // Connect stream to analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      setState((prev) => ({ ...prev, isActive: true }));

      // Start analysis
      analyzeAudio();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to access microphone";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isActive: false,
      }));
      console.error("Voice Activity Detection initialization failed:", error);
    }
  }, [sampleRate, fftSize, analyzeAudio]);

  // Effect to handle recording state changes
  useEffect(() => {
    if (isRecording) {
      initializeAudio();
    } else {
      cleanup();
    }

    return cleanup;
  }, [isRecording, initializeAudio, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    ...state,
    // Helper methods
    reset: useCallback(() => {
      setState((prev) => ({
        ...prev,
        isSpeaking: false,
        volume: 0,
        duration: 0,
        error: null,
      }));
      speechStartTimeRef.current = null;
    }, []),

    // Configuration getters
    getThreshold: () => threshold,
    getSilenceDuration: () => silenceDuration,
    getMinSpeechDuration: () => minSpeechDuration,
  };
}

export type { UseVoiceActivityDetectionOptions, VoiceActivityDetectionState };
