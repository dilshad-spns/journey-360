import React, { useState, useRef } from 'react';
import { Mic, MicOff, Sparkles, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface InputLayerProps {
  onUserInput: (input: string) => void;
  isProcessing: boolean;
}

export function InputLayer({ onUserInput, isProcessing }: InputLayerProps) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<number | null>(null);

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

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingTime(0);
      
      // Simulate speech-to-text result
      const simulatedText = 'Create a contact form with name, email, and message fields';
      setInput(simulatedText);
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
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
              className="bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary/90 transition-all"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              {isProcessing ? 'Generating...' : 'Generate Form'}
            </Button>

            <Button
              onClick={toggleRecording}
              variant="outline"
              className={`border-2 rounded-[var(--radius-button)] transition-all ${
                isRecording 
                  ? 'bg-destructive/10 border-destructive text-destructive hover:bg-destructive/20' 
                  : 'border-border hover:border-primary hover:bg-primary/5 hover:text-primary'
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
              className="text-left p-5 bg-card border-2 border-border rounded-[var(--radius-card)] hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <p className="text-foreground group-hover:text-primary transition-colors">{story}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
