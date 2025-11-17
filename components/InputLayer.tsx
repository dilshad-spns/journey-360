import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Sparkles, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { createWhisperService, WhisperService } from '../utils/whisperService';
import { toast } from 'sonner';

interface InputLayerProps {
  onUserInput: (input: string) => void;
  isProcessing: boolean;
}

export function InputLayer({ onUserInput, isProcessing }: InputLayerProps) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<number | null>(null);
  const whisperServiceRef = useRef<WhisperService | null>(null);

  // Initialize Whisper service
  useEffect(() => {
    if (typeof window !== 'undefined') {
      whisperServiceRef.current = createWhisperService();
    }
  }, []);

  const exampleStories = [
    'Create a travel insurance quote and buy journey',
    'Build a life insurance quote and buy journey',
    'Design an insurance claim submission journey',
    'Create a home insurance quote journey',
    'Build a motor insurance renewal journey',
    'Design a health insurance family floater quote and buy journey',
  ];

  const handleSubmit = () => {
    if (input.trim()) {
      onUserInput(input.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  const toggleRecording = async () => {
    if (!whisperServiceRef.current) {
      toast.error('Speech service not initialized');
      return;
    }

    if (!WhisperService.isSupported()) {
      toast.error('Audio recording is not supported in this browser');
      return;
    }

    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingTime(0);
      
      toast.info('Processing audio...');
      
      try {
        const audioBlob = await whisperServiceRef.current.stopRecording();
        
        if (audioBlob.size < 1000) {
          toast.error('No speech detected. Please try again.');
          return;
        }

        const result = await whisperServiceRef.current.transcribe(audioBlob);
        
        if (result.success && result.text) {
          setInput(prev => prev + (prev ? ' ' : '') + result.text);
          toast.success('Speech transcribed successfully');
        } else {
          toast.error(result.error || 'Failed to transcribe audio');
        }
      } catch (error) {
        console.error('Error processing audio:', error);
        toast.error('Failed to process audio. Please try again.');
      }
    } else {
      // Start recording
      try {
        await whisperServiceRef.current.startRecording();
        setIsRecording(true);
        setRecordingTime(0);
        timerRef.current = window.setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
        toast.success('Recording... Click again to stop', {
          duration: 3000,
          icon: '🎤',
        });
      } catch (error) {
        console.error('Error starting recording:', error);
        setIsRecording(false);
        
        if (error instanceof Error && error.message.includes('permission')) {
          toast.error('Microphone access denied. Please enable microphone permissions.');
        } else {
          toast.error('Failed to start recording. Please check your microphone.');
        }
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-[var(--radius-card)] bg-primary flex items-center justify-center">
          <FileText className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-foreground">Input Layer</h2>
          <p className="text-muted-foreground">Describe your form or use speech input</p>
        </div>
      </div>

      <Card className="p-6 bg-card border border-border rounded-[var(--radius-card)]" style={{ boxShadow: 'var(--elevation-md)' }}>
        <div className="space-y-5">
          <div className="space-y-3">
            <label htmlFor="user-story" className="text-foreground">User Story / Requirements</label>
            <Textarea
              id="user-story"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Example: Create a contact form with name, email, phone number, and message fields. Email and name should be required..."
              className="min-h-[140px] bg-input-background border-border rounded-[var(--radius-input)] resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              disabled={isRecording || isProcessing}
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={handleSubmit}
              disabled={!input.trim() || isProcessing || isRecording}
              className="bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary-hover transition-all"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              {isProcessing ? 'Generating...' : 'Generate Form'}
            </Button>

            <Button
              onClick={toggleRecording}
              variant="outline"
              className={`border-2 rounded-[var(--radius-button)] transition-all ${
                isRecording 
                  ? 'bg-destructive-hover-bg border-destructive text-destructive hover:bg-destructive-hover-bg' 
                  : 'border-border hover:border-border-hover hover:bg-primary-hover-bg hover:text-primary'
              }`}
              disabled={isProcessing}
            >
              {isRecording ? (
                <>
                  <MicOff className="h-4 w-4 mr-1" />
                  Stop Recording {formatTime(recordingTime)}
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-1" />
                  Voice Input
                </>
              )}
            </Button>
          </div>

          {isRecording && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive rounded-[var(--radius)]">
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-destructive rounded-[var(--radius-pill)]"
                    style={{
                      height: `${12 + Math.random() * 12}px`,
                      animation: 'pulse 1s ease-in-out infinite',
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
              <span className="text-destructive">Recording... Speak your requirements</span>
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-foreground">Example User Stories</h3>
          <Badge className="bg-primary text-primary-foreground rounded-[var(--radius-pill)]">
            Quick Start
          </Badge>
        </div>
        <div className="grid gap-3">
          {exampleStories.map((story, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(story)}
              disabled={isProcessing || isRecording}
              className="text-left p-5 bg-card border-2 border-border rounded-[var(--radius-card)] hover:border-border-hover hover:bg-primary-hover-bg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <p className="text-foreground group-hover:text-primary transition-colors">{story}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
