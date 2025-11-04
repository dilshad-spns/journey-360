import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
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
  Image as ImageIcon
} from 'lucide-react';


interface InputRequirementScreenProps {
  mode: 'text' | 'speech' | 'upload';
  onBack: () => void;
  onContinue: (requirements: string) => void;
  initialRequirements?: string;
}

export function InputRequirementScreen({ mode, onBack, onContinue, initialRequirements = '' }: InputRequirementScreenProps) {
  const [input, setInput] = useState(initialRequirements);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingTime(0);
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      
      // Simulate speech-to-text after 3 seconds
      setTimeout(() => {
        setInput('Create a travel insurance quote and buy journey with trip details, traveler information, and coverage selection');
      }, 3000);
    }
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    // Simulate document text extraction
    setTimeout(() => {
      setInput(`Extracted from ${file.name}:\n\nCreate a comprehensive insurance application form with multi-step journey including personal details, coverage options, and payment processing.`);
    }, 1000);
  };

  const handleImageSelect = (file: File) => {
    setUploadedImage(file);
    // Simulate image analysis/OCR
    setTimeout(() => {
      setInput(prev => prev + `\n\nImage analysis from ${file.name}: Detected form wireframe with fields for name, email, phone, and address sections.`);
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
    'Be specific about field types and validations',
    'Mention if multi-step form is needed',
    'Include any business rules or calculations',
    'Specify required vs optional fields',
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          onClick={onBack}
          className="mb-4 bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center h-12 w-12 rounded-[var(--radius-card)] mb-3 ${
              mode === 'text' ? 'bg-accent' : 
              mode === 'speech' ? 'bg-purple' : 
              'bg-success'
            }`}>
              {mode === 'text' && <FileText className="h-6 w-6 text-accent-foreground" />}
              {mode === 'speech' && <Mic className="h-6 w-6 text-purple-foreground" />}
              {mode === 'upload' && <Upload className="h-6 w-6 text-success-foreground" />}
            </div>
            <h2 className="text-foreground mb-2">
              {mode === 'text' && 'Enter Your Requirements'}
              {mode === 'speech' && 'Speak Your Requirements'}
              {mode === 'upload' && 'Upload Your Requirements'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {mode === 'text' && 'Describe the form or journey you want to create'}
              {mode === 'speech' && 'Click the microphone and start speaking'}
              {mode === 'upload' && 'Upload a document containing your requirements'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Input Area */}
            <div className="lg:col-span-2">
              <Card className="p-5 bg-card border border-border rounded-[var(--radius-card)]">
                {/* Text Input Mode */}
                {mode === 'text' && (
                  <div className="space-y-3">
                    <label className="text-foreground">Requirements</label>
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Example: Create a travel insurance quote and buy journey with trip details, traveler information, and coverage selection..."
                      className="min-h-[400px] bg-input-background border-border rounded-[var(--radius-input)] resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <input
                          ref={imageInputRef}
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageSelect(file);
                          }}
                        />
                        <Button
                          onClick={() => imageInputRef.current?.click()}
                          size="sm"
                          variant="outline"
                          className="border-2 border-border rounded-[var(--radius-button)] hover:border-primary hover:bg-primary/5"
                        >
                          <ImageIcon className="h-4 w-4 mr-1" />
                          Upload Image
                        </Button>
                        {uploadedImage && (
                          <Badge className="bg-success text-success-foreground rounded-[var(--radius-pill)]">
                            Image: {uploadedImage.name}
                          </Badge>
                        )}
                      </div>
                      <span className="text-muted-foreground">
                        {input.length} characters
                      </span>
                    </div>
                  </div>
                )}

                {/* Speech Input Mode */}
                {mode === 'speech' && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center py-8">
                      <button
                        onClick={toggleRecording}
                        className={`h-24 w-24 rounded-full flex items-center justify-center transition-all ${
                          isRecording
                            ? 'bg-destructive/10 border-4 border-destructive animate-pulse'
                            : 'bg-purple hover:bg-purple/90 border-4 border-purple/20'
                        }`}
                        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                        aria-pressed={isRecording}
                      >
                        {isRecording ? (
                          <MicOff className="h-12 w-12 text-destructive" aria-hidden="true" />
                        ) : (
                          <Mic className="h-12 w-12 text-purple-foreground" aria-hidden="true" />
                        )}
                      </button>
                      <p className="text-foreground mt-4">
                        {isRecording ? `Recording... ${formatTime(recordingTime)}` : 'Click to start recording'}
                      </p>
                      {isRecording && (
                        <Badge className="bg-destructive text-destructive-foreground rounded-[var(--radius-pill)] mt-2">
                          Live
                        </Badge>
                      )}
                    </div>

                    {/* Live Preview */}
                    <div className="space-y-2">
                      <label className="text-foreground">Live Transcription</label>
                      <div className="min-h-[200px] p-4 bg-input-background border border-border rounded-[var(--radius-input)]">
                        <p className="text-foreground whitespace-pre-wrap">
                          {input || 'Your speech will appear here...'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Mode */}
                {mode === 'upload' && (
                  <div className="space-y-4">
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-[var(--radius-card)] p-8 text-center transition-all ${
                        isDragging
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".txt,.doc,.docx,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file);
                        }}
                      />
                      {!uploadedFile ? (
                        <>
                          <div className="h-12 w-12 rounded-[var(--radius-card)] bg-success flex items-center justify-center mx-auto mb-3">
                            <Upload className="h-6 w-6 text-success-foreground" />
                          </div>
                          <h3 className="text-foreground mb-2">Drop your file here</h3>
                          <p className="text-muted-foreground mb-3">
                            or click to browse
                          </p>
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary/90"
                          >
                            Choose File
                          </Button>
                          <p className="text-muted-foreground mt-3">
                            Supported formats: TXT, DOC, DOCX, PDF
                          </p>
                        </>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-card rounded-[var(--radius)] border border-border">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="h-10 w-10 rounded-[var(--radius)] bg-success flex items-center justify-center flex-shrink-0" aria-hidden="true">
                              <File className="h-5 w-5 text-success-foreground" />
                            </div>
                            <div className="text-left min-w-0 flex-1">
                              <p className="text-foreground truncate" title={uploadedFile.name}>{uploadedFile.name}</p>
                              <p className="text-muted-foreground">
                                {(uploadedFile.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setUploadedFile(null);
                              setInput('');
                            }}
                            className="text-destructive hover:bg-destructive/10 p-2 rounded-[var(--radius)] flex-shrink-0"
                            aria-label="Remove uploaded file"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Extracted Text Preview */}
                    {input && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <label className="text-foreground">Extracted Content</label>
                        </div>
                        <div className="min-h-[200px] p-4 bg-input-background border border-border rounded-[var(--radius-input)]">
                          <p className="text-foreground whitespace-pre-wrap">{input}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="border border-border rounded-[var(--radius-button)] hover:border-primary hover:bg-primary/5 hover:text-primary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={!input.trim()}
                  className="bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary/90"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Guidelines Panel */}
            <div className="lg:col-span-1">
              <Card className="p-4 bg-card border border-border rounded-[var(--radius-card)] sticky top-8">
                <h4 className="text-foreground mb-3">Tips for Better Results</h4>
                <div className="space-y-2.5">
                  {guidelines.map((guideline, index) => (
                    <div key={index} className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 text-success-foreground" />
                      </div>
                      <p className="text-muted-foreground">{guideline}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-[var(--radius)]">
                  <h5 className="text-foreground mb-1.5">Example</h5>
                  <p className="text-muted-foreground">
                    "Create a travel insurance quote and buy journey"
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
