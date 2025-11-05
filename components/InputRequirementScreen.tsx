import React, { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  FileText,
  Mic,
  MicOff,
  Upload,
  ArrowLeft,
  ArrowRight,
  File,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useSpeechToText } from "../hooks/useSpeechToText";

interface InputRequirementScreenProps {
  mode: "text" | "speech" | "upload";
  onBack: () => void;
  onContinue: (requirements: string) => void;
  initialRequirements?: string;
}

export function InputRequirementScreen({
  mode,
  onBack,
  onContinue,
  initialRequirements = "",
}: InputRequirementScreenProps) {
  const [input, setInput] = useState(initialRequirements);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Speech-to-Text hook with integrated VAD
  const speechToText = useSpeechToText({
    language: "en",
    sampleRate: 16000,
    chunkDuration: 1000,
    apiEndpoint: "/api/speech-to-text",
    useWebSocket: false,
    vadThreshold: 25,
    vadSilenceDuration: 1500,
    vadMinSpeechDuration: 300,
    autoStart: false,
    autoStop: true,
    maxRecordingDuration: 300000, // 5 minutes max
  });

  // Update input when transcription changes
  useEffect(() => {
    if (speechToText.totalText) {
      setInput(speechToText.totalText);
    }
  }, [speechToText.totalText]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleRecording = async () => {
    if (speechToText.isRecording) {
      speechToText.stopRecording();
    } else {
      await speechToText.startRecording();
    }
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    // Simulate document text extraction
    setTimeout(() => {
      setInput(
        `Extracted from ${file.name}:\n\nCreate a comprehensive insurance application form with multi-step journey including personal details, coverage options, and payment processing.`
      );
    }, 1000);
  };

  const handleImageSelect = (file: File) => {
    setUploadedImage(file);
    // Simulate image analysis/OCR
    setTimeout(() => {
      setInput(
        (prev) =>
          prev +
          `\n\nImage analysis from ${file.name}: Detected form wireframe with fields for name, email, phone, and address sections.`
      );
    }, 1000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleContinue = () => {
    if (input.trim()) {
      onContinue(input.trim());
    }
  };

  const guidelines = [
    "Be specific about field types and validations",
    "Mention if multi-step form is needed",
    "Include any business rules or calculations",
    "Specify required vs optional fields",
    "Voice mode detects when you start/stop speaking",
  ];

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-6'>
        {/* Back Button */}
        <Button
          onClick={onBack}
          className='mb-4 bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary/90'
        >
          <ArrowLeft className='h-4 w-4 mr-1' />
          Back
        </Button>

        <div className='max-w-6xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-6'>
            <div
              className={`inline-flex items-center justify-center h-12 w-12 rounded-[var(--radius-card)] mb-3 ${
                mode === "text"
                  ? "bg-accent"
                  : mode === "speech"
                  ? "bg-purple"
                  : "bg-success"
              }`}
            >
              {mode === "text" && (
                <FileText className='h-6 w-6 text-accent-foreground' />
              )}
              {mode === "speech" && (
                <Mic className='h-6 w-6 text-purple-foreground' />
              )}
              {mode === "upload" && (
                <Upload className='h-6 w-6 text-success-foreground' />
              )}
            </div>
            <h2 className='text-foreground mb-2'>
              {mode === "text" && "Enter Your Requirements"}
              {mode === "speech" && "Speak Your Requirements"}
              {mode === "upload" && "Upload Your Requirements"}
            </h2>
            <p className='text-muted-foreground max-w-2xl mx-auto'>
              {mode === "text" &&
                "Describe the form or journey you want to create"}
              {mode === "speech" && "Click the microphone and start speaking"}
              {mode === "upload" &&
                "Upload a document containing your requirements"}
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
            {/* Main Input Area */}
            <div className='lg:col-span-2'>
              <Card className='p-5 bg-card border border-border rounded-[var(--radius-card)]'>
                {/* Text Input Mode */}
                {mode === "text" && (
                  <div className='space-y-3'>
                    <label className='text-foreground'>Requirements</label>
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder='Example: Create a travel insurance quote and buy journey with trip details, traveler information, and coverage selection...'
                      className='min-h-[400px] bg-input-background border-border rounded-[var(--radius-input)] resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                    />
                    <div className='flex justify-between items-center'>
                      <div className='flex gap-2'>
                        <input
                          ref={imageInputRef}
                          type='file'
                          className='hidden'
                          accept='image/*'
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageSelect(file);
                          }}
                        />
                        <Button
                          onClick={() => imageInputRef.current?.click()}
                          size='sm'
                          variant='outline'
                          className='border-2 border-border rounded-[var(--radius-button)] hover:border-primary hover:bg-primary/5'
                        >
                          <ImageIcon className='h-4 w-4 mr-1' />
                          Upload Image
                        </Button>
                        {uploadedImage && (
                          <Badge className='bg-success text-success-foreground rounded-[var(--radius-pill)]'>
                            Image: {uploadedImage.name}
                          </Badge>
                        )}
                      </div>
                      <span className='text-muted-foreground'>
                        {input.length} characters
                      </span>
                    </div>
                  </div>
                )}

                {/* Speech Input Mode */}
                {mode === "speech" && (
                  <div className='space-y-4'>
                    <div className='flex flex-col items-center justify-center py-8'>
                      <div className='relative'>
                        <button
                          onClick={toggleRecording}
                          disabled={speechToText.isProcessing}
                          className={`h-24 w-24 rounded-full flex items-center justify-center transition-all ${
                            speechToText.isRecording
                              ? speechToText.vad.isSpeaking
                                ? "bg-success/10 border-4 border-success animate-pulse"
                                : "bg-destructive/10 border-4 border-destructive"
                              : "bg-purple hover:bg-purple/90 border-4 border-purple/20 disabled:opacity-50"
                          }`}
                          aria-label={
                            speechToText.isRecording
                              ? "Stop recording"
                              : "Start recording"
                          }
                          aria-pressed={speechToText.isRecording}
                        >
                          {speechToText.isRecording ? (
                            <MicOff
                              className='h-12 w-12 text-destructive'
                              aria-hidden='true'
                            />
                          ) : (
                            <Mic
                              className='h-12 w-12 text-purple-foreground'
                              aria-hidden='true'
                            />
                          )}
                        </button>

                        {/* Voice Activity & Connection Indicators */}
                        {speechToText.isRecording &&
                          speechToText.vad.isActive && (
                            <div className='absolute -bottom-2 -right-2'>
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                  speechToText.vad.isSpeaking
                                    ? "bg-success"
                                    : "bg-muted"
                                }`}
                              >
                                {speechToText.vad.isSpeaking ? (
                                  <Volume2 className='h-4 w-4 text-success-foreground' />
                                ) : (
                                  <VolumeX className='h-4 w-4 text-muted-foreground' />
                                )}
                              </div>
                            </div>
                          )}

                        {/* Connection Status */}
                        {speechToText.isRecording && (
                          <div className='absolute -top-2 -left-2'>
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                speechToText.isConnected
                                  ? "bg-success"
                                  : "bg-destructive"
                              }`}
                            >
                              {speechToText.isConnected ? (
                                <Wifi className='h-4 w-4 text-success-foreground' />
                              ) : (
                                <WifiOff className='h-4 w-4 text-destructive-foreground' />
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <p className='text-foreground mt-4'>
                        {speechToText.isProcessing
                          ? "Processing..."
                          : speechToText.isRecording
                          ? `Recording... ${formatTime(
                              speechToText.recordingDuration
                            )}`
                          : "Click to start recording"}
                      </p>

                      <div className='flex flex-wrap gap-2 mt-2 justify-center'>
                        {speechToText.isRecording && (
                          <Badge className='bg-destructive text-destructive-foreground rounded-[var(--radius-pill)]'>
                            Live
                          </Badge>
                        )}
                        {speechToText.vad.isSpeaking && (
                          <Badge className='bg-success text-success-foreground rounded-[var(--radius-pill)]'>
                            Speaking
                          </Badge>
                        )}
                        {speechToText.isProcessing && (
                          <Badge className='bg-primary text-primary-foreground rounded-[var(--radius-pill)]'>
                            Processing
                          </Badge>
                        )}
                        {speechToText.isConnected &&
                          speechToText.isRecording && (
                            <Badge className='bg-success text-success-foreground rounded-[var(--radius-pill)]'>
                              Connected
                            </Badge>
                          )}
                        {speechToText.error && (
                          <Badge className='bg-destructive text-destructive-foreground rounded-[var(--radius-pill)]'>
                            Error
                          </Badge>
                        )}
                      </div>

                      {/* Volume Level Indicator */}
                      {speechToText.isRecording &&
                        speechToText.vad.isActive && (
                          <div className='mt-3 w-32'>
                            <div className='flex justify-between text-xs text-muted-foreground mb-1'>
                              <span>Volume</span>
                              <span>{speechToText.vad.volume}%</span>
                            </div>
                            <div className='w-full bg-muted rounded-full h-2'>
                              <div
                                className={`h-2 rounded-full transition-all duration-150 ${
                                  speechToText.vad.volume >
                                  speechToText.vad.getThreshold()
                                    ? "bg-success"
                                    : "bg-muted-foreground"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    speechToText.vad.volume,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                      {/* Speech Duration */}
                      {speechToText.vad.isSpeaking &&
                        speechToText.vad.duration > 0 && (
                          <div className='mt-2'>
                            <Badge className='bg-primary text-primary-foreground rounded-[var(--radius-pill)]'>
                              Speech:{" "}
                              {(speechToText.vad.duration / 1000).toFixed(1)}s
                            </Badge>
                          </div>
                        )}
                    </div>

                    {/* Live Preview */}
                    <div className='space-y-2'>
                      <div className='flex justify-between items-center'>
                        <label className='text-foreground'>
                          Live Transcription
                        </label>
                        <div className='flex gap-2'>
                          {speechToText.partialTranscription && (
                            <Badge className='bg-primary/20 text-primary rounded-[var(--radius-pill)]'>
                              Partial
                            </Badge>
                          )}
                          {speechToText.error && (
                            <Badge className='bg-destructive text-destructive-foreground rounded-[var(--radius-pill)]'>
                              API Error
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className='min-h-[200px] p-4 bg-input-background border border-border rounded-[var(--radius-input)]'>
                        {speechToText.error ? (
                          <div className='text-destructive'>
                            <p className='font-medium'>Speech-to-Text Error</p>
                            <p className='text-sm mt-1'>{speechToText.error}</p>
                            <p className='text-sm mt-2 text-muted-foreground'>
                              Please check your internet connection and try
                              again.
                            </p>
                          </div>
                        ) : (
                          <div className='space-y-2'>
                            {/* Final Transcription */}
                            {speechToText.transcription && (
                              <p className='text-foreground whitespace-pre-wrap'>
                                {speechToText.transcription}
                              </p>
                            )}

                            {/* Partial Transcription */}
                            {speechToText.partialTranscription && (
                              <p className='text-muted-foreground italic whitespace-pre-wrap'>
                                {speechToText.partialTranscription}...
                              </p>
                            )}

                            {/* Status Messages */}
                            {!speechToText.transcription &&
                              !speechToText.partialTranscription && (
                                <p className='text-muted-foreground'>
                                  {speechToText.isRecording &&
                                  speechToText.vad.isActive
                                    ? speechToText.vad.isSpeaking
                                      ? "Listening... speak now"
                                      : "Ready to listen..."
                                    : "Your speech will appear here..."}
                                </p>
                              )}
                          </div>
                        )}
                      </div>

                      {/* Transcription Actions */}
                      {speechToText.hasText && (
                        <div className='flex gap-2 justify-end'>
                          <Button
                            onClick={speechToText.clearTranscription}
                            size='sm'
                            variant='outline'
                            className='border border-border rounded-[var(--radius-button)] hover:border-primary hover:bg-primary/5'
                          >
                            Clear
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Upload Mode */}
                {mode === "upload" && (
                  <div className='space-y-4'>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-[var(--radius-card)] p-8 text-center transition-all ${
                        isDragging
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary hover:bg-primary/5"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type='file'
                        className='hidden'
                        accept='.txt,.doc,.docx,.pdf'
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file);
                        }}
                      />
                      {!uploadedFile ? (
                        <>
                          <div className='h-12 w-12 rounded-[var(--radius-card)] bg-success flex items-center justify-center mx-auto mb-3'>
                            <Upload className='h-6 w-6 text-success-foreground' />
                          </div>
                          <h3 className='text-foreground mb-2'>
                            Drop your file here
                          </h3>
                          <p className='text-muted-foreground mb-3'>
                            or click to browse
                          </p>
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            className='bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary/90'
                          >
                            Choose File
                          </Button>
                          <p className='text-muted-foreground mt-3'>
                            Supported formats: TXT, DOC, DOCX, PDF
                          </p>
                        </>
                      ) : (
                        <div className='flex items-center justify-between p-3 bg-card rounded-[var(--radius)] border border-border'>
                          <div className='flex items-center gap-3 min-w-0 flex-1'>
                            <div
                              className='h-10 w-10 rounded-[var(--radius)] bg-success flex items-center justify-center flex-shrink-0'
                              aria-hidden='true'
                            >
                              <File className='h-5 w-5 text-success-foreground' />
                            </div>
                            <div className='text-left min-w-0 flex-1'>
                              <p
                                className='text-foreground truncate'
                                title={uploadedFile.name}
                              >
                                {uploadedFile.name}
                              </p>
                              <p className='text-muted-foreground'>
                                {(uploadedFile.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setUploadedFile(null);
                              setInput("");
                            }}
                            className='text-destructive hover:bg-destructive/10 p-2 rounded-[var(--radius)] flex-shrink-0'
                            aria-label='Remove uploaded file'
                          >
                            <X className='h-4 w-4' />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Extracted Text Preview */}
                    {input && (
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                          <CheckCircle2 className='h-5 w-5 text-primary' />
                          <label className='text-foreground'>
                            Extracted Content
                          </label>
                        </div>
                        <div className='min-h-[200px] p-4 bg-input-background border border-border rounded-[var(--radius-input)]'>
                          <p className='text-foreground whitespace-pre-wrap'>
                            {input}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {/* Action Buttons */}
              <div className='flex justify-end gap-3 mt-4'>
                <Button
                  variant='outline'
                  onClick={onBack}
                  className='border border-border rounded-[var(--radius-button)] hover:border-primary hover:bg-primary/5 hover:text-primary'
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={!input.trim()}
                  className='bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary/90'
                >
                  Continue
                  <ArrowRight className='h-4 w-4 ml-1' />
                </Button>
              </div>
            </div>

            {/* Guidelines Panel */}
            <div className='lg:col-span-1'>
              <Card className='p-4 bg-card border border-border rounded-[var(--radius-card)] sticky top-8'>
                <h4 className='text-foreground mb-3'>
                  Tips for Better Results
                </h4>
                <div className='space-y-2.5'>
                  {guidelines.map((guideline, index) => (
                    <div key={index} className='flex items-start gap-2.5'>
                      <div className='h-5 w-5 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-0.5'>
                        <CheckCircle2 className='h-3 w-3 text-success-foreground' />
                      </div>
                      <p className='text-muted-foreground'>{guideline}</p>
                    </div>
                  ))}
                </div>

                <div className='mt-4 space-y-3'>
                  <div className='p-3 bg-primary/5 border border-primary/20 rounded-[var(--radius)]'>
                    <h5 className='text-foreground mb-1.5'>Example</h5>
                    <p className='text-muted-foreground'>
                      "Create a travel insurance quote and buy journey"
                    </p>
                  </div>

                  {mode === "speech" && (
                    <div className='p-3 bg-success/5 border border-success/20 rounded-[var(--radius)]'>
                      <h5 className='text-foreground mb-1.5'>Voice Features</h5>
                      <ul className='text-muted-foreground text-sm space-y-1'>
                        <li>• Auto-detects when you start speaking</li>
                        <li>• Shows real-time volume levels</li>
                        <li>• Stops after silence period</li>
                        <li>• Visual feedback for voice activity</li>
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
