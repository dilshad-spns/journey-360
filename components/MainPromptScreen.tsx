import React, { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Sparkles,
  Mic,
  MicOff,
  Upload,
  ArrowRight,
  Clock,
  Zap,
  Image as ImageIcon,
  FileText,
  Sun,
  Moon,
  X,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { createWhisperService, WhisperService } from "../utils/whisperService";

interface MainPromptScreenProps {
  onContinue: (requirements: string) => void;
}

export function MainPromptScreen({ onContinue }: MainPromptScreenProps) {
  const [requirements, setRequirements] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [attachments, setAttachments] = useState<
    Array<{ name: string; type: "image" | "document"; data: string }>
  >([]);
  const [darkMode, setDarkMode] = useState(false);
  const recognitionRef = useRef<any>(null);
  const whisperServiceRef = useRef<WhisperService | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize Whisper service
  useEffect(() => {
    if (typeof window !== "undefined") {
      whisperServiceRef.current = createWhisperService();
    }
  }, []);

  // Initialize dark mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDarkMode = localStorage.getItem("darkMode");
      const isDark = savedDarkMode !== null ? savedDarkMode === "true" : true;
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", newDarkMode.toString());
      if (newDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const recentPrompts = [
    "Create a travel insurance quote form with trip details, traveler information, coverage selection, and payment processing",
    "Build a death claim submission journey for life insurance with claim details, document uploads, assessment workflow, and payment information",
    "Design a car insurance quote form with vehicle details, driver information, coverage options, and instant quote calculator",
    "Create a health insurance enrollment form with personal details, medical history, plan selection, and beneficiary designation",
  ];

  const tips = [
    "Describe your form in natural language - be as detailed or brief as you like",
    "Include field types, validations, and business rules in your description",
    "Mention multi-step flows, conditional logic, or API integrations if needed",
    "Voice input works best in quiet environments - speak clearly and naturally",
    "Upload requirement documents or screenshots for automatic parsing",
  ];

  const handleMicrophoneToggle = async () => {
    // Check if Whisper service is available
    if (!whisperServiceRef.current) {
      toast.error("Speech service not initialized");
      return;
    }

    if (!WhisperService.isSupported()) {
      toast.error("Audio recording is not supported in this browser");
      return;
    }

    // If currently listening, stop recording and transcribe
    if (isListening) {
      setIsListening(false);
      toast.info("Processing audio...");

      try {
        const audioBlob = await whisperServiceRef.current.stopRecording();

        // Check if audio has content
        if (audioBlob.size < 1000) {
          toast.error("No speech detected. Please try again.");
          return;
        }

        const result = await whisperServiceRef.current.transcribe(audioBlob);

        if (result.success && result.text) {
          setRequirements((prev) => prev + (prev ? " " : "") + result.text);
          toast.success("Speech transcribed successfully");
        } else {
          toast.error(result.error || "Failed to transcribe audio");
        }
      } catch (error) {
        console.error("Error processing audio:", error);
        toast.error("Failed to process audio. Please try again.");
      }
      return;
    }

    // Start recording
    try {
      await whisperServiceRef.current.startRecording();
      setIsListening(true);
      toast.success("Recording... Click again to stop", {
        duration: 3000,
        icon: "🎤",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsListening(false);

      if (error instanceof Error && error.message.includes("permission")) {
        toast.error(
          "Microphone access denied. Please enable microphone permissions in your browser settings."
        );
      } else {
        toast.error("Failed to start recording. Please check your microphone.");
      }
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAttachments((prev) => [
        ...prev,
        { name: file.name, type: "image", data: result },
      ]);
      toast.success("Image uploaded - AI will analyze it with your prompt");
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAttachments((prev) => [
        ...prev,
        { name: file.name, type: "document", data: result },
      ]);
      toast.success("Document uploaded");
    };
    reader.readAsText(file);
  };

  const handleContinue = () => {
    if (!requirements.trim()) {
      toast.error("Please describe what you want to build");
      return;
    }
    onContinue(requirements);
  };

  return (
    <div className='h-screen bg-background relative overflow-hidden flex flex-col'>
      {/* Vibrant background */}
      <div className='absolute inset-0'>
        <div className='absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-accent/20 to-purple/20 rounded-full blur-3xl animate-pulse' />
        <div
          className='absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse'
          style={{ animationDelay: "1.5s" }}
        />
        <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5' />
      </div>

      {/* Grid pattern */}
      <div
        className='absolute inset-0 opacity-10'
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.08), transparent 60%)",
        }}
      />

      {/* Dark mode toggle */}
      <div className='absolute top-6 right-6 z-10'>
        <Button
          variant='outline'
          size='sm'
          onClick={toggleDarkMode}
          className='hidden rounded-[var(--radius-button)] bg-card border border-border hover:bg-secondary hover:border-primary transition-all shadow-[var(--elevation-sm)]'
        >
          {darkMode ? (
            <Sun className='h-5 w-5' />
          ) : (
            <Moon className='h-5 w-5' />
          )}
        </Button>
      </div>

      <div className='relative container mx-auto px-6 py-12 flex-1 overflow-y-auto min-h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
        {/* Purple glow background effect */}
        <div className='absolute inset-0 -z-10 overflow-hidden pointer-events-none'>
          <div className='absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple/20 rounded-full blur-[120px]'></div>
        </div>

        {/* Header */}
        <div className='text-center mb-12 max-w-4xl mx-auto'>
          <h1 className='text-foreground mb-3'>
            What would you like to build?
          </h1>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Describe your form in natural language. Use voice, upload a
            document, or type your requirements.
          </p>
        </div>

        {/* Main prompt area */}
        <div className='max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700'>
          {/* Center section with logo and title */}
          <div className='relative p-[3px] bg-gradient-to-r from-accent via-purple to-primary rounded-[24px]'>
            <div className='overflow-hidden border-0 bg-card rounded-[21px] flex flex-col'>
              {/* Input Section - With Padding */}
              <div className='px-6 pt-6 pb-4'>
                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Describe your idea, and I'll bring it to life"
                  className='w-full h-[250px] px-0 py-0 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:outline-none resize-none overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.metaKey) {
                      e.preventDefault();
                      handleContinue();
                    }
                  }}
                />
              </div>

              {/* Footer Section - Full Width with Border Top */}
              <div className='border-t border-border bg-muted/30'>
                {/* Attachment Chips - Show when attachments exist */}
                {attachments.length > 0 && (
                  <div className='px-6 pt-3 pb-2 border-b border-border/50'>
                    <div className='flex flex-wrap gap-2'>
                      {attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className='flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-[var(--radius-pill)] border border-border group hover:border-destructive/50 transition-all'
                        >
                          {attachment.type === "image" ? (
                            <ImageIcon className='h-3.5 w-3.5 text-muted-foreground' />
                          ) : (
                            <FileText className='h-3.5 w-3.5 text-muted-foreground' />
                          )}
                          <span
                            className='text-foreground'
                            style={{ fontSize: "11px" }}
                          >
                            {attachment.name}
                          </span>
                          <button
                            onClick={() =>
                              setAttachments((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                            className='text-muted-foreground hover:text-destructive transition-colors'
                          >
                            <X className='h-3 w-3' />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className='px-6 py-3'>
                  <div className='flex items-center justify-between gap-4'>
                    {/* Left: Plus Button */}
                    <button
                      className='h-9 w-9 rounded-[8px] hover:bg-background/80 text-foreground flex items-center justify-center transition-all flex-shrink-0'
                      title='Add more'
                    >
                      <Plus className='h-4 w-4' />
                    </button>

                    {/* Center: Action Buttons Row - Chip Style */}
                    <div className='flex items-center gap-3 flex-wrap justify-start flex-1'>
                      {/* Image Button */}
                      <div className='relative p-[2px] rounded-full bg-transparent hover:bg-gradient-to-r hover:from-accent hover:via-purple hover:to-primary transition-all'>
                        <button
                          onClick={() => {
                            if (attachments.length >= 2) {
                              toast.error("Maximum 2 attachments allowed");
                              return;
                            }
                            imageInputRef.current?.click();
                          }}
                          disabled={attachments.length >= 2}
                          className='flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-card text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                          <ImageIcon className='h-4 w-4' />
                          <span>Image</span>
                        </button>
                      </div>

                      {/* Doc Button */}
                      <div className='relative p-[2px] rounded-full bg-transparent hover:bg-gradient-to-r hover:from-accent hover:via-purple hover:to-primary transition-all'>
                        <button
                          onClick={() => {
                            if (attachments.length >= 2) {
                              toast.error("Maximum 2 attachments allowed");
                              return;
                            }
                            fileInputRef.current?.click();
                          }}
                          disabled={attachments.length >= 2}
                          className='flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-card text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                          <FileText className='h-4 w-4' />
                          <span>Doc</span>
                        </button>
                      </div>

                      {/* Code Button */}
                      <div className='relative p-[2px] rounded-full bg-transparent hover:bg-gradient-to-r hover:from-accent hover:via-purple hover:to-primary transition-all'>
                        <button className='flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-card text-foreground transition-all'>
                          <span>&lt;/&gt;</span>
                          <span>Code</span>
                        </button>
                      </div>
                    </div>

                    {/* Right: Mic & Send Buttons */}
                    <div className='flex items-center gap-2 flex-shrink-0'>
                      <button
                        onClick={handleMicrophoneToggle}
                        className={`h-9 w-9 rounded-[8px] transition-all flex items-center justify-center relative ${
                          isListening
                            ? "bg-destructive/20 text-destructive"
                            : "hover:bg-background/80 text-muted-foreground hover:text-foreground"
                        }`}
                        title={
                          isListening ? "Stop recording" : "Start voice input"
                        }
                      >
                        {isListening ? (
                          <MicOff className='h-4 w-4' />
                        ) : (
                          <Mic className='h-4 w-4' />
                        )}
                      </button>

                      <button
                        onClick={handleContinue}
                        disabled={!requirements.trim()}
                        className='h-9 w-9 rounded-[8px] bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-all shadow-[var(--elevation-sm)] hover:shadow-[var(--elevation-md)] hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-primary'
                        title='Send'
                      >
                        <ArrowRight className='h-4 w-4' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hidden File Inputs */}
              <input
                ref={imageInputRef}
                type='file'
                className='hidden'
                accept='image/*'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
              <input
                ref={fileInputRef}
                type='file'
                className='hidden'
                accept='.txt,.doc,.docx,.pdf'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </div>
          </div>

          {/* Tips */}
          <div className='mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
            {tips.slice(0, 3).map((tip, index) => (
              <div
                key={index}
                className='flex items-start gap-2 p-3 bg-card/50 border border-border rounded-[var(--radius)] hover:bg-card/80 transition-all'
              >
                <Sparkles
                  className='h-4 w-4 text-accent mt-0.5 flex-shrink-0'
                  strokeWidth={1.25}
                />
                <p className='text-muted-foreground'>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Prompts */}
        <div className='max-w-4xl mx-auto'>
          <Card className='mt-12 mb-12 p-6 bg-card/50 backdrop-blur-xl border border-border rounded-[var(--radius-card)] hover:bg-card/80 transition-all'>
            <div className='flex items-center justify-between mb-4 pb-4 border-b border-border'>
              <div className='flex items-center gap-3'>
                <div className='h-8 w-8 rounded-[var(--radius)] bg-primary/10 flex items-center justify-center'>
                  <Clock className='h-4 w-4 text-primary' strokeWidth={1.25} />
                </div>
                <h3 className='text-foreground'>Recent Examples</h3>
              </div>
              <Badge className='bg-accent/10 text-accent border-accent/20 rounded-[var(--radius-pill)]'>
                Quick Start
              </Badge>
            </div>

            <div className='space-y-3'>
              {recentPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setRequirements(prompt);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setTimeout(() => textareaRef.current?.focus(), 300);
                  }}
                  className='text-left w-full p-4 bg-background/50 border border-border rounded-[var(--radius-card)] hover:border-primary hover:bg-primary/5 hover:shadow-[var(--elevation-sm)] transition-all group'
                >
                  <div className='flex items-center justify-between gap-4'>
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <FileText
                        className='h-4 w-4 text-accent group-hover:text-primary transition-colors flex-shrink-0'
                        strokeWidth={1.25}
                      />
                      <p className='text-foreground group-hover:text-primary transition-colors truncate'>
                        {prompt}
                      </p>
                    </div>
                    <ArrowRight
                      className='h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0'
                      strokeWidth={1.25}
                    />
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
