// Test file to check if the hook imports correctly
import { useSpeechToText } from "../hooks/useSpeechToText";

// Simple test to verify the hook returns the expected interface
export function TestSpeechToTextHook() {
  const speechToText = useSpeechToText();

  // This should not cause any TypeScript errors if the hook is correctly typed
  const {
    isRecording,
    isProcessing,
    transcription,
    partialTranscription,
    error,
    isConnected,
    recordingDuration,
    vad,
    startRecording,
    stopRecording,
    reset,
    clearTranscription,
    testConnection,
    totalText,
    hasText,
    canRecord,
    options,
  } = speechToText;

  return (
    <div>
      <p>Is Recording: {isRecording ? "Yes" : "No"}</p>
      <p>Is Processing: {isProcessing ? "Yes" : "No"}</p>
      <p>Transcription: {transcription}</p>
      <p>Partial: {partialTranscription}</p>
      <p>Error: {error}</p>
      <p>Connected: {isConnected ? "Yes" : "No"}</p>
      <p>Duration: {recordingDuration}ms</p>
      <p>Total Text: {totalText}</p>
      <p>Has Text: {hasText ? "Yes" : "No"}</p>
      <p>Can Record: {canRecord ? "Yes" : "No"}</p>
      <p>VAD Volume: {vad.volume}%</p>
      <button onClick={startRecording}>Start</button>
      <button onClick={stopRecording}>Stop</button>
      <button onClick={reset}>Reset</button>
      <button onClick={clearTranscription}>Clear</button>
      <button onClick={testConnection}>Test</button>
    </div>
  );
}
