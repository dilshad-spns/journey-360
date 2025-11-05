import { useCallback, useEffect, useRef, useState } from "react";
import { useVoiceActivityDetection } from "./useVoiceActivityDetection";
import {
  SpeechToTextClient,
  createSpeechToTextClient,
} from "../utils/speechToTextClient";

interface UseSpeechToTextOptions {
  language?: string;
  sampleRate?: number;
  chunkDuration?: number;
  apiEndpoint?: string;
  useWebSocket?: boolean;
  // VAD options
  vadThreshold?: number;
  vadSilenceDuration?: number;
  vadMinSpeechDuration?: number;
  // Auto-processing options
  autoStart?: boolean;
  autoStop?: boolean;
  maxRecordingDuration?: number; // in milliseconds
}

interface SpeechToTextState {
  isRecording: boolean;
  isProcessing: boolean;
  transcription: string;
  partialTranscription: string;
  error: string | null;
  isConnected: boolean;
  recordingDuration: number;
}

export function useSpeechToText(options: UseSpeechToTextOptions = {}) {
  const {
    language = "en",
    sampleRate = 16000,
    chunkDuration = 1000,
    apiEndpoint = "/api/speech-to-text",
    useWebSocket = false,
    vadThreshold = 25,
    vadSilenceDuration = 2000,
    vadMinSpeechDuration = 500,
    autoStart = false,
    autoStop = true,
    maxRecordingDuration = 60000, // 60 seconds max
  } = options;

  const [state, setState] = useState<SpeechToTextState>({
    isRecording: false,
    isProcessing: false,
    transcription: "",
    partialTranscription: "",
    error: null,
    isConnected: false,
    recordingDuration: 0,
  });

  const clientRef = useRef<SpeechToTextClient | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const maxDurationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Voice Activity Detection
  const vad = useVoiceActivityDetection(state.isRecording, {
    threshold: vadThreshold,
    silenceDuration: vadSilenceDuration,
    minSpeechDuration: vadMinSpeechDuration,
  });

  // Handle transcription results
  const handleTranscription = useCallback((text: string, isFinal: boolean) => {
    setState((prev) => ({
      ...prev,
      [isFinal ? "transcription" : "partialTranscription"]: text,
      isProcessing: !isFinal,
    }));

    if (isFinal) {
      setState((prev) => ({ ...prev, partialTranscription: "" }));
    }
  }, []);

  // Handle errors
  const handleError = useCallback((error: string) => {
    setState((prev) => ({
      ...prev,
      error,
      isProcessing: false,
      isRecording: false,
    }));

    if (clientRef.current) {
      clientRef.current.stopRecording();
    }

    cleanup();
  }, []);

  // Initialize client
  const initializeClient = useCallback(() => {
    if (!clientRef.current) {
      clientRef.current = createSpeechToTextClient(
        handleTranscription,
        handleError,
        {
          language,
          sampleRate,
          chunkDuration,
          apiEndpoint,
          useWebSocket,
        }
      );
    }
  }, [
    language,
    sampleRate,
    chunkDuration,
    apiEndpoint,
    useWebSocket,
    handleTranscription,
    handleError,
  ]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (maxDurationTimerRef.current) {
      clearTimeout(maxDurationTimerRef.current);
      maxDurationTimerRef.current = null;
    }
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null, isProcessing: true }));

      initializeClient();

      if (clientRef.current) {
        await clientRef.current.startRecording();

        setState((prev) => ({
          ...prev,
          isRecording: true,
          isConnected: true,
          isProcessing: false,
          recordingDuration: 0,
        }));

        // Start recording duration timer
        recordingTimerRef.current = setInterval(() => {
          setState((prev) => ({
            ...prev,
            recordingDuration: prev.recordingDuration + 100,
          }));
        }, 100);

        // Set maximum recording duration timer
        if (maxRecordingDuration > 0) {
          maxDurationTimerRef.current = setTimeout(() => {
            stopRecording();
          }, maxRecordingDuration);
        }
      }
    } catch (error) {
      handleError(
        `Failed to start recording: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }, [initializeClient, maxRecordingDuration, handleError]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (clientRef.current && state.isRecording) {
      clientRef.current.stopRecording();
    }

    setState((prev) => ({
      ...prev,
      isRecording: false,
      isProcessing: false,
    }));

    cleanup();
  }, [state.isRecording, cleanup]);

  // Auto-start based on voice activity
  useEffect(() => {
    if (
      autoStart &&
      !state.isRecording &&
      vad.isSpeaking &&
      vad.duration > vadMinSpeechDuration
    ) {
      startRecording();
    }
  }, [
    autoStart,
    state.isRecording,
    vad.isSpeaking,
    vad.duration,
    vadMinSpeechDuration,
    startRecording,
  ]);

  // Auto-stop based on voice activity
  useEffect(() => {
    if (
      autoStop &&
      state.isRecording &&
      !vad.isSpeaking &&
      !state.isProcessing
    ) {
      // Add a small delay to avoid stopping too quickly
      const timer = setTimeout(() => {
        if (!vad.isSpeaking && state.isRecording) {
          stopRecording();
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    autoStop,
    state.isRecording,
    state.isProcessing,
    vad.isSpeaking,
    stopRecording,
  ]);

  // Test connection
  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      initializeClient();
      if (clientRef.current) {
        return await clientRef.current.testConnection();
      }
      return false;
    } catch {
      return false;
    }
  }, [initializeClient]);

  // Reset state
  const reset = useCallback(() => {
    stopRecording();
    setState({
      isRecording: false,
      isProcessing: false,
      transcription: "",
      partialTranscription: "",
      error: null,
      isConnected: false,
      recordingDuration: 0,
    });
    vad.reset();
  }, [stopRecording, vad]);

  // Clear transcription
  const clearTranscription = useCallback(() => {
    setState((prev) => ({
      ...prev,
      transcription: "",
      partialTranscription: "",
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.stopRecording();
      }
      cleanup();
    };
  }, [cleanup]);

  return {
    // State
    ...state,
    vad, // Expose VAD state

    // Actions
    startRecording,
    stopRecording,
    reset,
    clearTranscription,
    testConnection,

    // Computed values
    totalText:
      state.transcription +
      (state.partialTranscription ? ` ${state.partialTranscription}` : ""),
    hasText: Boolean(state.transcription || state.partialTranscription),
    canRecord: !state.isRecording && !state.isProcessing,

    // Configuration
    options: {
      language,
      sampleRate,
      chunkDuration,
      apiEndpoint,
      useWebSocket,
      vadThreshold,
      vadSilenceDuration,
      vadMinSpeechDuration,
      autoStart,
      autoStop,
      maxRecordingDuration,
    },
  };
}

export type { UseSpeechToTextOptions, SpeechToTextState };
