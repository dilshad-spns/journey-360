import React, { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { RichTextEditor } from "./RichTextEditor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  FileText,
  Mic,
  MicOff,
  Upload,
  ArrowLeft,
  File,
  CheckCircle2,
  X,
  ChevronDown,
  FileUp,
  Code2,
  Palette,
  Sparkles,
  Link2,
  Image as ImageIcon,
  Globe,
  Zap,
  Box,
  Lightbulb,
  Plus,
  PenTool,
  Play,
  SlidersHorizontal,
  Crown,
  ArrowRight,
  Shield,
} from "lucide-react";
import GrammarlyIcon1 from "../imports/GrammarlyIcon1";
import Jira1 from "../imports/Jira1";
import GitHub1 from "../imports/GitHub1";
import { toast } from "sonner";

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
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [selectedImportType, setSelectedImportType] =
    useState<string>("Upload");
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [isJiraDialogOpen, setIsJiraDialogOpen] = useState(false);
  const [jiraInput, setJiraInput] = useState("");
  const [isGitHubDialogOpen, setIsGitHubDialogOpen] = useState(false);
  const [gitHubInput, setGitHubInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");
  const [speechError, setSpeechError] = useState<string>("");
  const [micPermission, setMicPermission] = useState<
    "granted" | "denied" | "prompt" | "checking"
  >("checking");
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Initialize input from initialRequirements prop
  useEffect(() => {
    console.log("🔍 InputRequirementScreen: mounted/updated");
    console.log(
      "🔍 InputRequirementScreen: initialRequirements =",
      initialRequirements
    );
    console.log("🔍 InputRequirementScreen: current input state =", input);

    if (initialRequirements) {
      console.log(
        "✅ InputRequirementScreen: Setting input to initialRequirements:",
        initialRequirements
      );
      setInput(initialRequirements);
    } else {
      console.log(
        "ℹ️ InputRequirementScreen: No initial requirements provided"
      );

      // Set helpful initial message for speech mode
      if (mode === "speech" && !input) {
        // Don't set placeholder in input, just show in UI
      }
    }
  }, [initialRequirements]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Check microphone permission on mount
  useEffect(() => {
    const checkMicPermission = async () => {
      if (typeof window === "undefined" || !navigator.permissions) {
        setMicPermission("prompt");
        return;
      }

      try {
        const result = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });
        setMicPermission(result.state as "granted" | "denied" | "prompt");

        // Listen for permission changes
        result.onchange = () => {
          setMicPermission(result.state as "granted" | "denied" | "prompt");
        };
      } catch (error) {
        // Permissions API not supported or microphone not in query
        setMicPermission("prompt");
      }
    };

    checkMicPermission();
  }, []);

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleRecording = async () => {
    console.log("🎤 toggleRecording called, isRecording:", isRecording);

    if (isRecording) {
      // Stop recording
      console.log("🛑 Stopping recording...");
      setIsRecording(false);
      setSpeechError("");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      setRecordingTime(0);
    } else {
      console.log("▶️ Starting recording...");
      // Clear any previous errors
      setSpeechError("");

      // Check if we're in a secure context (HTTPS or localhost)
      const isSecureContext =
        typeof window !== "undefined" &&
        (window.isSecureContext ||
          window.location.protocol === "https:" ||
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1");

      if (!isSecureContext) {
        setSpeechError(
          "Microphone access requires HTTPS. Please access this page via HTTPS or use localhost for development."
        );
        setMicPermission("denied");
        return;
      }

      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setSpeechError(
          "Your browser doesn't support microphone access. Please use a modern browser like Chrome, Edge, or Safari."
        );
        setMicPermission("denied");
        return;
      }

      // Request microphone permission first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        // Permission granted - stop the stream as we only needed it for permission
        stream.getTracks().forEach((track) => track.stop());
        setMicPermission("granted");
      } catch (error: any) {
        console.error("Microphone permission error:", error);
        setMicPermission("denied");

        // Build detailed error message
        let errorMessage = "";
        let helpText = "";

        if (
          error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError"
        ) {
          errorMessage = "Microphone access was denied.";

          // Provide browser-specific instructions
          const userAgent = navigator.userAgent.toLowerCase();
          if (userAgent.includes("chrome") && !userAgent.includes("edge")) {
            helpText =
              'Chrome: Click the 🔒 or 🎤 icon in the address bar, find "Microphone", select "Allow", then refresh the page.';
          } else if (userAgent.includes("edge")) {
            helpText =
              'Edge: Click the 🔒 icon in the address bar, find "Microphone", select "Allow", then refresh the page.';
          } else if (userAgent.includes("safari")) {
            helpText =
              "Safari: Go to Safari > Settings for This Website > Microphone > Allow, then refresh the page.";
          } else if (userAgent.includes("firefox")) {
            helpText =
              "Firefox: Click the 🔒 icon > Connection Secure > More Information > Permissions > Use the Microphone > Allow.";
          } else {
            helpText =
              "Please check your browser settings to allow microphone access for this site.";
          }

          setSpeechError(`${errorMessage} ${helpText}`);
        } else if (
          error.name === "NotFoundError" ||
          error.name === "DevicesNotFoundError"
        ) {
          setSpeechError(
            "No microphone found. Please connect a microphone to your device and try again."
          );
        } else if (error.name === "NotSupportedError") {
          setSpeechError(
            "Your browser doesn't support microphone access. Please use Chrome, Edge, or Safari."
          );
        } else if (
          error.name === "NotReadableError" ||
          error.name === "TrackStartError"
        ) {
          setSpeechError(
            "Your microphone is already in use by another application. Please close other apps using the microphone and try again."
          );
        } else if (error.name === "OverconstrainedError") {
          setSpeechError(
            "Unable to access microphone with the requested settings. Please try again."
          );
        } else if (error.name === "SecurityError") {
          setSpeechError(
            "Microphone access blocked due to security settings. Please ensure you're accessing the site via HTTPS."
          );
        } else {
          setSpeechError(
            `Unable to access microphone: ${
              error.message || error.name
            }. Please check your browser and system settings.`
          );
        }
        return;
      }

      // Start recording
      setIsRecording(true);
      setRecordingTime(0);
      setTranscriptText("");

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Initialize Web Speech API
      if (typeof window !== "undefined") {
        const SpeechRecognition =
          (window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition;

        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = "en-US";

          recognition.onresult = (event: any) => {
            let interimTranscript = "";
            let finalTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript + " ";
              } else {
                interimTranscript += transcript;
              }
            }

            // Update the input with the transcript
            if (finalTranscript) {
              setInput((prev) => {
                const newText = prev
                  ? `${prev} ${finalTranscript}`.trim()
                  : finalTranscript.trim();
                return newText;
              });
            }

            // Show interim results
            if (interimTranscript) {
              setTranscriptText(interimTranscript);
            }
          };

          recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);

            let errorMessage = "";
            switch (event.error) {
              case "not-allowed":
                errorMessage =
                  "Microphone access denied. Please allow microphone access in your browser settings.";
                setMicPermission("denied");
                break;
              case "no-speech":
                errorMessage = "No speech detected. Please try speaking again.";
                break;
              case "audio-capture":
                errorMessage =
                  "No microphone found. Please check your microphone connection.";
                break;
              case "network":
                errorMessage =
                  "Network error. Please check your internet connection.";
                break;
              case "aborted":
                // User stopped recording, no error needed
                break;
              default:
                errorMessage = `Speech recognition error: ${event.error}. Please try again.`;
            }

            if (errorMessage) {
              setSpeechError(errorMessage);
            }

            setIsRecording(false);
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            setRecordingTime(0);
          };

          recognition.onend = () => {
            if (isRecording) {
              // Restart if still recording
              try {
                recognition.start();
              } catch (error) {
                console.error("Error restarting recognition:", error);
                setIsRecording(false);
                if (timerRef.current) {
                  clearInterval(timerRef.current);
                  timerRef.current = null;
                }
                setRecordingTime(0);
              }
            }
          };

          recognitionRef.current = recognition;

          try {
            recognition.start();
          } catch (error) {
            console.error("Error starting recognition:", error);
            setSpeechError(
              "Unable to start speech recognition. Please try again."
            );
            setIsRecording(false);
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            setRecordingTime(0);
          }
        } else {
          // Fallback: Browser doesn't support speech recognition
          setSpeechError(
            "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari, or type your requirements instead."
          );
          setIsRecording(false);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setRecordingTime(0);
        }
      }
    }
  };

  const handleFileSelect = async (file: File) => {
    setUploadedFile(file);
    setUploadedImage(file);
    setIsProcessingFile(true);

    try {
      let extractedText = "";

      // Handle different file types
      if (file.type === "text/plain") {
        // Read text file
        extractedText = await file.text();
      } else if (file.type === "application/pdf") {
        // For PDF files, we'll simulate extraction since we can't include pdf.js
        extractedText = `[PDF Content from ${file.name}]\n\nCreate a comprehensive insurance application form with multi-step journey including personal details, coverage options, and payment processing. The form should include field validations, conditional logic, and integration with payment gateway.`;
      } else if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword"
      ) {
        // For Word documents, simulate extraction
        extractedText = `[Document Content from ${file.name}]\n\nCreate a comprehensive insurance application form with multi-step journey including personal details, coverage options, and payment processing. Include proper validations and business rules.`;
      } else if (file.type.startsWith("image/")) {
        // For images, just note that an image was uploaded
        extractedText = `[Image uploaded: ${file.name}]\n\nPlease describe what you'd like to build based on this image.`;
      } else {
        // Unknown file type
        extractedText = `[File uploaded: ${file.name}]\n\nCreate a form based on this document.`;
      }

      // Set the extracted text
      setTimeout(() => {
        setInput(extractedText);
        setIsProcessingFile(false);
      }, 1000);
    } catch (error) {
      console.error("Error processing file:", error);
      setInput(
        `Error processing ${file.name}. Please try a different file or paste your requirements manually.`
      );
      setIsProcessingFile(false);
    }
  };

  const handleContinue = () => {
    if (input.trim()) {
      onContinue(input.trim());
    }
  };

  const correctGrammar = () => {
    if (!input.trim()) return;

    // Mock grammar correction - in production, this would call an AI API
    let correctedText = input;
    const originalText = input;

    // Basic grammar corrections
    const corrections: { [key: string]: string } = {
      // Common grammar mistakes
      dont: "don't",
      doesnt: "doesn't",
      didnt: "didn't",
      wont: "won't",
      cant: "can't",
      shouldnt: "shouldn't",
      wouldnt: "wouldn't",
      couldnt: "couldn't",
      isnt: "isn't",
      arent: "aren't",
      wasnt: "wasn't",
      werent: "weren't",
      hasnt: "hasn't",
      havent: "haven't",
      hadnt: "hadn't",

      // Common typos
      teh: "the",
      taht: "that",
      thier: "their",
      recieve: "receive",
      occured: "occurred",
      seperate: "separate",
      definately: "definitely",
      wiht: "with",
      youre: "you're",
      "your welcome": "you're welcome",
      "its a": "it's a",
      alot: "a lot",
      untill: "until",
      succesful: "successful",
    };

    // Apply corrections (case-insensitive)
    Object.entries(corrections).forEach(([wrong, right]) => {
      const regex = new RegExp(`\\b${wrong}\\b`, "gi");
      correctedText = correctedText.replace(regex, right);
    });

    // Capitalize first letter of sentences
    correctedText = correctedText.replace(/(^\w|[.!?]\s+\w)/g, (match) =>
      match.toUpperCase()
    );

    // Fix double spaces
    correctedText = correctedText.replace(/\s+/g, " ");

    // Update the input with corrected text
    setInput(correctedText);

    // Show feedback to user
    if (originalText !== correctedText) {
      toast.success("Grammar corrected successfully!", {
        description: "Your text has been improved with grammar fixes.",
      });
    } else {
      toast.success("No grammar issues found!", {
        description: "Your text looks good.",
      });
    }
  };

  const handleOpenCodeDialog = () => {
    setIsCodeDialogOpen(true);
    setCodeInput("");
  };

  const handleInsertCode = () => {
    if (codeInput.trim()) {
      // Append the code to the existing input with proper formatting
      const newInput = input.trim()
        ? `${input}\n\n\`\`\`\n${codeInput.trim()}\n\`\`\``
        : `\`\`\`\n${codeInput.trim()}\n\`\`\``;
      setInput(newInput);
      setIsCodeDialogOpen(false);
      setCodeInput("");
    }
  };

  const handleImportFromUrl = () => {
    if (urlInput.trim()) {
      const newInput = input.trim()
        ? `${input}\n\nImported from URL: ${urlInput.trim()}`
        : `Imported from URL: ${urlInput.trim()}`;
      setInput(newInput);
      setIsUrlDialogOpen(false);
      setUrlInput("");
    }
  };

  const handleImportFromJira = () => {
    if (jiraInput.trim()) {
      const newInput = input.trim()
        ? `${input}\n\nImported from Jira: ${jiraInput.trim()}`
        : `Imported from Jira: ${jiraInput.trim()}`;
      setInput(newInput);
      setIsJiraDialogOpen(false);
      setJiraInput("");
    }
  };

  const handleImportFromGitHub = () => {
    if (gitHubInput.trim()) {
      const newInput = input.trim()
        ? `${input}\n\nImported from GitHub: ${gitHubInput.trim()}`
        : `Imported from GitHub: ${gitHubInput.trim()}`;
      setInput(newInput);
      setIsGitHubDialogOpen(false);
      setGitHubInput("");
    }
  };

  const importOptions = [
    {
      icon: FileUp,
      label: "Upload file",
      description: "Upload a document",
      color: "text-primary",
      action: () => {
        setSelectedImportType("Upload file");
        fileInputRef.current?.click();
      },
    },
    {
      icon: Palette,
      label: "Import from Figma",
      description: "Import Figma designs",
      color: "text-accent",
      action: () => setSelectedImportType("Import from Figma"),
    },
    {
      icon: Link2,
      label: "Connect an app",
      description: "Integrate external apps",
      color: "text-purple",
      action: () => setSelectedImportType("Connect an app"),
    },
    {
      icon: ImageIcon,
      label: "Upload image",
      description: "Upload an image file",
      color: "text-success",
      action: () => {
        setSelectedImportType("Upload image");
        imageInputRef.current?.click();
      },
    },
    {
      icon: Code2,
      label: "Import code",
      description: "Import existing code",
      color: "text-orange",
      action: () => setSelectedImportType("Import code"),
    },
    {
      icon: Globe,
      label: "Import from URL",
      description: "Import from web URL",
      color: "text-blue",
      action: () => setSelectedImportType("Import from URL"),
    },
  ];

  const guidelines =
    mode === "speech"
      ? [
          "Speak clearly and at a moderate pace",
          "Describe field types and validations",
          "Mention multi-step requirements",
          "Include business rules in your narration",
        ]
      : mode === "upload"
      ? [
          "Upload PDF, DOCX, or text files",
          "Drag and drop files into the zone",
          "We'll extract requirements automatically",
          "Review and edit extracted text",
        ]
      : [
          "Be specific about field types and validations",
          "Mention if multi-step form is needed",
          "Include any business rules or calculations",
          "Specify required vs optional fields",
        ];

  return (
    <div className='min-h-screen bg-background relative overflow-hidden'>
      {/* Background Gradients */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-accent/[0.02] pointer-events-none' />
      <div className='absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-accent/[0.08] to-transparent rounded-full blur-3xl pointer-events-none' />
      <div className='absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple/[0.08] to-transparent rounded-full blur-3xl pointer-events-none' />

      <div className='relative container mx-auto px-6 py-6'>
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant='ghost'
          className='mb-6 rounded-[var(--radius-button)] hover:bg-muted transition-all'
        >
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>

        {/* Permission Warning Banner for Speech Mode */}
        {mode === "speech" && micPermission === "denied" && (
          <div className='mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-[var(--radius-card)] max-w-4xl mx-auto'>
            <div className='flex items-start gap-3'>
              <div className='h-5 w-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5'>
                <Shield className='h-3 w-3 text-destructive' />
              </div>
              <div className='flex-1'>
                <h4 className='text-destructive mb-1'>
                  Microphone Access Required
                </h4>
                <p className='text-muted-foreground text-sm mb-2'>
                  Speech recognition requires microphone access. Please enable
                  it in your browser settings.
                </p>
                <details className='text-xs text-muted-foreground'>
                  <summary className='cursor-pointer hover:text-foreground transition-colors'>
                    Show instructions for your browser
                  </summary>
                  <div className='mt-2 space-y-2 pl-4 border-l-2 border-border'>
                    <p>
                      <strong>Chrome/Edge:</strong> Click the 🔒 icon in address
                      bar → Microphone → Allow → Refresh
                    </p>
                    <p>
                      <strong>Safari:</strong> Safari menu → Settings for This
                      Website → Microphone → Allow → Refresh
                    </p>
                    <p>
                      <strong>Firefox:</strong> Click 🔒 icon → More Information
                      → Permissions → Microphone → Allow
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        )}

        {/* HTTPS Warning Banner */}
        {typeof window !== "undefined" &&
          !window.isSecureContext &&
          window.location.hostname !== "localhost" && (
            <div className='mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-[var(--radius-card)] max-w-4xl mx-auto'>
              <div className='flex items-start gap-3'>
                <Shield className='h-5 w-5 text-destructive flex-shrink-0 mt-0.5' />
                <div>
                  <h4 className='text-destructive mb-1'>
                    Secure Connection Required
                  </h4>
                  <p className='text-muted-foreground text-sm'>
                    Microphone access requires HTTPS. Please access this page
                    via{" "}
                    <code className='px-1 py-0.5 bg-muted rounded text-xs'>
                      https://
                    </code>{" "}
                    instead of{" "}
                    <code className='px-1 py-0.5 bg-muted rounded text-xs'>
                      http://
                    </code>
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-[var(--radius-pill)] mb-4'>
            {mode === "text" && <FileText className='h-4 w-4 text-primary' />}
            {mode === "speech" && <Mic className='h-4 w-4 text-primary' />}
            {mode === "upload" && <Upload className='h-4 w-4 text-primary' />}
            <span className='text-primary'>
              {mode === "text" && "Paste User Story"}
              {mode === "speech" && "Narrate User Story"}
              {mode === "upload" && "Upload Requirement Document"}
            </span>
          </div>
          <h1 className='text-foreground mb-3 text-[20px] font-bold'>
            What would you like to create?
          </h1>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Describe your journey in natural language, and we'll generate a
            complete deployable form with UI, validations, and tests.
          </p>
        </div>

        {/* Main Layout: Side by Side */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto'>
          {/* Left: Main Input Area (Canva Style) - 2 columns */}
          <div className='lg:col-span-2'>
            {/* Gradient Border Container */}
            <div className='relative p-[3px] rounded-[24px] bg-gradient-to-r from-accent via-purple to-primary'>
              <div className='overflow-hidden border-0 bg-card rounded-[21px] flex flex-col'>
                {/* Input Section - With Padding */}
                <div className='px-6 pt-6 pb-4'>
                  {/* Top Section - Input Area with Right Icons */}
                  <div className='flex items-start gap-3'>
                    {/* Main Input Area - Takes most space */}
                    <div className='flex-1 relative'>
                      {mode === "upload" && !input ? (
                        /* Upload Drop Zone */
                        <div
                          ref={dropZoneRef}
                          onDragEnter={handleDragEnter}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`
                            w-full h-[250px] border-2 border-dashed rounded-[var(--radius-card)]
                            flex flex-col items-center justify-center gap-4 cursor-pointer
                            transition-all duration-300
                            ${
                              isDragging
                                ? "border-primary bg-primary/5 scale-[1.02]"
                                : "border-border hover:border-primary/50 hover:bg-muted/30"
                            }
                            ${
                              isProcessingFile
                                ? "pointer-events-none opacity-60"
                                : ""
                            }
                          `}
                        >
                          <div
                            className={`h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center transition-transform ${
                              isDragging ? "scale-110" : ""
                            }`}
                          >
                            <Upload className='h-8 w-8 text-primary' />
                          </div>
                          <div className='text-center'>
                            <p className='text-foreground mb-1'>
                              {isProcessingFile
                                ? "Processing file..."
                                : isDragging
                                ? "Drop your file here"
                                : "Drag and drop your file here"}
                            </p>
                            <p className='text-muted-foreground text-sm'>
                              or click to browse
                            </p>
                            <p className='text-muted-foreground text-xs mt-2'>
                              Supports: PDF, DOCX, TXT, Images
                            </p>
                          </div>
                        </div>
                      ) : mode === "speech" ? (
                        /* Speech Mode: Centered Microphone Interface */
                        <div className='w-full h-[250px] flex flex-col items-center justify-center'>
                          {/* Large Microphone Button */}
                          <button
                            type='button'
                            onClick={toggleRecording}
                            disabled={micPermission === "denied"}
                            className={`
                              relative h-32 w-32 rounded-full flex items-center justify-center
                              transition-all duration-300 group z-10
                              ${
                                isRecording
                                  ? "bg-destructive/20 hover:bg-destructive/30 scale-110"
                                  : micPermission === "denied"
                                  ? "bg-destructive/10 cursor-not-allowed opacity-50"
                                  : "bg-primary/10 hover:bg-primary/20 hover:scale-110"
                              }
                              ${
                                !isRecording && micPermission !== "denied"
                                  ? "animate-pulse"
                                  : ""
                              }
                              shadow-[var(--elevation-lg)] hover:shadow-[var(--elevation-xl)]
                            `}
                          >
                            {/* Ripple effect when recording */}
                            {isRecording && (
                              <>
                                <div className='absolute inset-0 rounded-full bg-destructive/20 animate-ping' />
                                <div className='absolute inset-0 rounded-full bg-destructive/10 animate-pulse' />
                              </>
                            )}

                            {/* Icon */}
                            {isRecording ? (
                              <MicOff className='h-16 w-16 text-destructive relative z-10' />
                            ) : (
                              <Mic
                                className={`h-16 w-16 relative z-10 ${
                                  micPermission === "denied"
                                    ? "text-destructive"
                                    : "text-primary"
                                }`}
                              />
                            )}

                            {/* Permission denied indicator */}
                            {micPermission === "denied" && !isRecording && (
                              <div className='absolute -top-2 -right-2 h-6 w-6 bg-destructive rounded-full border-4 border-card flex items-center justify-center'>
                                <X className='h-3 w-3 text-destructive-foreground' />
                              </div>
                            )}
                          </button>

                          {/* Status Text */}
                          <div className='mt-6 text-center'>
                            {isRecording ? (
                              <div className='flex flex-col items-center gap-2'>
                                <div className='flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-[var(--radius-pill)]'>
                                  <div className='h-2 w-2 rounded-full bg-destructive animate-pulse' />
                                  <span className='text-destructive'>
                                    Recording {formatTime(recordingTime)}
                                  </span>
                                </div>
                                <p className='text-muted-foreground text-sm'>
                                  Click microphone to stop
                                </p>
                              </div>
                            ) : micPermission === "denied" ? (
                              <div className='space-y-1'>
                                <p className='text-destructive'>
                                  Microphone access denied
                                </p>
                                <p className='text-muted-foreground text-sm'>
                                  Please enable in browser settings
                                </p>
                              </div>
                            ) : (
                              <div className='space-y-1'>
                                <p className='text-foreground'>
                                  Click to start narrating
                                </p>
                                <p className='text-muted-foreground text-sm'>
                                  Your voice will be transcribed in real-time
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Live Transcript Preview */}
                          {transcriptText && (
                            <div className='mt-4 px-4 py-2 bg-primary/5 border border-primary/20 rounded-[var(--radius-card)] max-w-md'>
                              <p className='text-primary text-sm italic text-center'>
                                "{transcriptText}"
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Text Mode: Regular Textarea */
                        <textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Describe your idea, and I'll bring it to life"
                          className='w-full h-[250px] px-0 py-0 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:outline-none resize-none'
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.metaKey) {
                              e.preventDefault();
                              handleContinue();
                            }
                          }}
                        />
                      )}

                      {/* Transcribed Text Display for Speech Mode */}
                      {mode === "speech" && input && (
                        <div className='mt-4 space-y-2'>
                          <div className='flex items-center justify-between'>
                            <label className='text-muted-foreground text-sm'>
                              Transcribed Text:
                            </label>
                            <button
                              type='button'
                              onClick={() => setInput("")}
                              className='text-muted-foreground hover:text-foreground text-xs transition-colors'
                            >
                              Clear
                            </button>
                          </div>
                          <div className='p-3 bg-muted/50 border border-border rounded-[var(--radius-card)] max-h-32 overflow-y-auto'>
                            <p className='text-foreground whitespace-pre-wrap'>
                              {input}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Status Indicators & Errors */}
                      {(isRecording ||
                        uploadedImage ||
                        isProcessingFile ||
                        speechError) && (
                        <div className='flex flex-col gap-2 mt-3'>
                          {/* Error Message */}
                          {speechError && (
                            <div className='p-3 bg-destructive/10 border border-destructive/20 rounded-[var(--radius-card)]'>
                              <div className='flex items-start gap-2'>
                                <div className='h-5 w-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5'>
                                  <X className='h-3 w-3 text-destructive' />
                                </div>
                                <div className='flex-1'>
                                  <p className='text-destructive text-sm mb-2'>
                                    {speechError}
                                  </p>
                                  <div className='flex items-center gap-2 flex-wrap'>
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      onClick={() =>
                                        window.open(
                                          "https://www.onlinemictest.com/",
                                          "_blank"
                                        )
                                      }
                                      className='h-7 text-xs bg-card hover:bg-muted border-border rounded-[var(--radius-button)]'
                                    >
                                      <Mic className='h-3 w-3 mr-1' />
                                      Test Microphone
                                    </Button>
                                    <a
                                      href='/MICROPHONE_PERMISSION_GUIDE.md'
                                      target='_blank'
                                      className='text-xs text-primary hover:underline'
                                    >
                                      View detailed guide →
                                    </a>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setSpeechError("")}
                                  className='text-destructive hover:text-destructive/70 transition-colors flex-shrink-0'
                                >
                                  <X className='h-4 w-4' />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Status Badges */}
                          <div className='flex items-center gap-2 flex-wrap'>
                            {isRecording && (
                              <Badge className='bg-gradient-to-r from-destructive/10 to-destructive/5 text-destructive border border-destructive/20 rounded-[var(--radius-pill)] px-3 py-1.5'>
                                <div className='h-2 w-2 rounded-full bg-destructive animate-pulse mr-2' />
                                Recording {formatTime(recordingTime)}
                              </Badge>
                            )}

                            {isProcessingFile && (
                              <Badge className='bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 rounded-[var(--radius-pill)] px-3 py-1.5'>
                                <div className='h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2' />
                                Processing file...
                              </Badge>
                            )}

                            {uploadedImage && !isProcessingFile && (
                              <Badge className='bg-gradient-to-r from-success/10 to-success/5 text-success border border-success/20 rounded-[var(--radius-pill)] px-3 py-1.5'>
                                <File className='h-3.5 w-3.5 mr-2' />
                                {uploadedImage.name}
                                <button
                                  onClick={() => {
                                    setUploadedImage(null);
                                    setUploadedFile(null);
                                    setInput("");
                                  }}
                                  className='ml-2 text-success hover:text-success/70 transition-colors'
                                >
                                  <X className='h-3.5 w-3.5' />
                                </button>
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Icons - Vertically Aligned Top */}
                    <div className='flex items-center gap-2 flex-shrink-0'>
                      {mode === "text" && (
                        <button
                          onClick={correctGrammar}
                          className='h-9 w-9 rounded-[8px] border border-border flex items-center justify-center transition-all group relative disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden hover:bg-muted/50'
                          title='Fix Grammar'
                          disabled={!input.trim()}
                        >
                          <div className='h-5 w-5'>
                            <GrammarlyIcon1 />
                          </div>
                          <span className='absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-card border border-border rounded-[var(--radius-button)] text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap text-xs shadow-[var(--elevation-sm)]'>
                            Fix Grammar
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Section - Full Width with Border Top */}
                <div className='border-t border-border bg-muted/30'>
                  <div className='px-6 py-3'>
                    <div className='flex items-center justify-between gap-4'>
                      {/* Left: Plus Button */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className='h-9 w-9 rounded-[8px] hover:bg-background/80 text-foreground flex items-center justify-center transition-all flex-shrink-0'
                            title='Add more'
                          >
                            <Plus className='h-4 w-4' />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align='start'
                          className='w-56 bg-card border-border rounded-[var(--radius-card)] shadow-[var(--elevation-md)]'
                        >
                          <DropdownMenuItem
                            onClick={() => setIsUrlDialogOpen(true)}
                            className='flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted rounded-[var(--radius-button)] text-foreground'
                          >
                            <Globe className='h-4 w-4 text-primary' />
                            <div>
                              <div>Import from URL</div>
                              <div className='text-muted-foreground text-xs'>
                                Import from web URL
                              </div>
                            </div>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => setIsJiraDialogOpen(true)}
                            className='flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted rounded-[var(--radius-button)] text-foreground'
                          >
                            <div className='h-4 w-4 flex-shrink-0'>
                              <Jira1 />
                            </div>
                            <div>
                              <div>Import from Jira</div>
                              <div className='text-muted-foreground text-xs'>
                                Import Jira ticket
                              </div>
                            </div>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => setIsGitHubDialogOpen(true)}
                            className='flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted rounded-[var(--radius-button)] text-foreground'
                          >
                            <div className='h-4 w-4 flex-shrink-0'>
                              <GitHub1 />
                            </div>
                            <div>
                              <div>Import from GitHub</div>
                              <div className='text-muted-foreground text-xs'>
                                Import GitHub repo
                              </div>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Center: Action Buttons Row - Chip Style (Hide in speech mode) */}
                      {mode !== "speech" && (
                        <div className='flex items-center gap-3 flex-wrap justify-start flex-1'>
                          {/* Image Button */}
                          <div className='relative p-[2px] rounded-full bg-transparent hover:bg-gradient-to-r hover:from-accent hover:via-purple hover:to-primary transition-all'>
                            <button
                              onClick={() => imageInputRef.current?.click()}
                              className='flex items-center gap-2 px-5 py-2 rounded-full border border-[#0F172A] bg-card text-foreground transition-all'
                            >
                              <ImageIcon className='h-4 w-4' />
                              <span>Image</span>
                            </button>
                          </div>

                          {/* Doc Button */}
                          <div className='relative p-[2px] rounded-full bg-transparent hover:bg-gradient-to-r hover:from-accent hover:via-purple hover:to-primary transition-all'>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className='flex items-center gap-2 px-5 py-2 rounded-full border border-[#0F172A] bg-card text-foreground transition-all'
                            >
                              <PenTool className='h-4 w-4' />
                              <span>Doc</span>
                            </button>
                          </div>

                          {/* Code Button */}
                          <div className='relative p-[2px] rounded-full bg-transparent hover:bg-gradient-to-r hover:from-accent hover:via-purple hover:to-primary transition-all'>
                            <button
                              onClick={handleOpenCodeDialog}
                              className='flex items-center gap-2 px-5 py-2 rounded-full border border-[#0F172A] bg-card text-foreground transition-all'
                            >
                              <Code2 className='h-4 w-4' />
                              <span>Code</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Speech Mode: Centered Text */}
                      {mode === "speech" && (
                        <div className='flex-1 flex items-center justify-center'>
                          <p className='text-muted-foreground text-sm'>
                            Click the microphone above to start narrating
                          </p>
                        </div>
                      )}

                      {/* Right: Mic & Send Buttons */}
                      <div className='flex items-center gap-2 flex-shrink-0'>
                        {/* Only show mic button in text mode, not in speech mode (mic is centered) */}
                        {mode === "text" && (
                          <button
                            onClick={toggleRecording}
                            className={`h-9 w-9 rounded-[8px] transition-all flex items-center justify-center relative ${
                              isRecording
                                ? "bg-destructive/20 text-destructive"
                                : micPermission === "denied"
                                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                                : "hover:bg-background/80 text-muted-foreground hover:text-foreground"
                            }`}
                            title={
                              isRecording
                                ? "Stop recording"
                                : micPermission === "denied"
                                ? "Microphone access denied - click to retry"
                                : "Start voice input"
                            }
                          >
                            {isRecording ? (
                              <MicOff className='h-4 w-4' />
                            ) : (
                              <Mic className='h-4 w-4' />
                            )}
                            {micPermission === "denied" && !isRecording && (
                              <div className='absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full border-2 border-card' />
                            )}
                          </button>
                        )}

                        <button
                          onClick={handleContinue}
                          disabled={!input.trim()}
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
                  ref={fileInputRef}
                  type='file'
                  className='hidden'
                  accept='.txt,.doc,.docx,.pdf'
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
                <input
                  ref={imageInputRef}
                  type='file'
                  className='hidden'
                  accept='image/*'
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right: Tips Panel */}
          <div className='lg:col-span-1'>
            <Card className='p-4 bg-[rgba(36,36,36,0)] border border-border rounded-[var(--radius-card)] sticky top-6'>
              <div className='flex items-center gap-2 mb-4'>
                <div className='h-8 w-8 rounded-[var(--radius-card)] bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center border border-accent/30'>
                  <Lightbulb className='h-4 w-4 text-accent' />
                </div>
                <h3 className='text-foreground'>Tips for Better Results</h3>
              </div>

              <div className='space-y-2.5 mb-4'>
                {guidelines.map((guideline, index) => (
                  <div key={index} className='flex items-start gap-2'>
                    <div className='h-5 w-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5'>
                      <div className='h-2 w-2 rounded-full bg-success' />
                    </div>
                    <p className='text-muted-foreground'>{guideline}</p>
                  </div>
                ))}
              </div>

              <div className='relative p-3.5 bg-muted border border-border rounded-[var(--radius-card)] hover:border-border-hover transition-all duration-300 overflow-hidden'>
                <div className='relative'>
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='h-6 w-6 rounded-[var(--radius-card)] bg-secondary flex items-center justify-center border border-border'>
                      {mode === "speech" ? (
                        <Mic className='h-3.5 w-3.5 text-accent' />
                      ) : mode === "upload" ? (
                        <Upload className='h-3.5 w-3.5 text-accent' />
                      ) : (
                        <FileText className='h-3.5 w-3.5 text-accent' />
                      )}
                    </div>
                    <h4
                      className='text-foreground'
                      style={{ fontSize: "0.813rem" }}
                    >
                      {mode === "speech"
                        ? "Example Narration"
                        : mode === "upload"
                        ? "Supported Files"
                        : "Example Input"}
                    </h4>
                  </div>
                  <p
                    className='text-foreground italic'
                    style={{ fontSize: "0.813rem" }}
                  >
                    {mode === "speech"
                      ? '"I need a travel insurance form with four steps: first, trip details like destination and dates, then traveler information, next coverage options, and finally payment"'
                      : mode === "upload"
                      ? "Upload user stories from Jira, PRDs from Confluence, or any requirements document in PDF, DOCX, or TXT format"
                      : '"Create a travel insurance quote and buy journey with 4 steps: trip details, traveler info, coverage selection, and payment processing"'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Code Paste Dialog */}
      <Dialog open={isCodeDialogOpen} onOpenChange={setIsCodeDialogOpen}>
        <DialogContent className='bg-card border-border rounded-[var(--radius-card)] max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='text-foreground flex items-center gap-2'>
              <div className='h-8 w-8 rounded-[var(--radius-button)] bg-primary/10 border border-primary/20 flex items-center justify-center'>
                <Code2 className='h-4 w-4 text-primary' />
              </div>
              Paste Your Code
            </DialogTitle>
            <DialogDescription className='text-muted-foreground'>
              Paste code snippets that describe your form requirements or
              structure. The code will be added to your input.
            </DialogDescription>
          </DialogHeader>

          <div className='py-4'>
            <textarea
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder='Paste your code here...'
              className='w-full h-[300px] px-4 py-3 bg-muted border border-border rounded-[var(--radius-input)] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none font-mono'
              autoFocus
            />
          </div>

          <DialogFooter className='gap-2'>
            <Button
              variant='outline'
              onClick={() => setIsCodeDialogOpen(false)}
              className='rounded-[var(--radius-button)] border-border'
            >
              Cancel
            </Button>
            <Button
              onClick={handleInsertCode}
              disabled={!codeInput.trim()}
              className='rounded-[var(--radius-button)] bg-primary text-primary-foreground hover:bg-primary/90'
            >
              <CheckCircle2 className='h-4 w-4 mr-2' />
              Insert Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* URL Import Dialog */}
      <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
        <DialogContent className='bg-card border-border rounded-[var(--radius-card)] max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='text-foreground flex items-center gap-2'>
              <div className='h-8 w-8 rounded-[var(--radius-button)] bg-primary/10 border border-primary/20 flex items-center justify-center'>
                <Globe className='h-4 w-4 text-primary' />
              </div>
              Import from URL
            </DialogTitle>
            <DialogDescription className='text-muted-foreground'>
              Enter the URL of the web page or resource you want to import.
            </DialogDescription>
          </DialogHeader>

          <div className='py-4'>
            <input
              type='url'
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder='https://example.com/requirements'
              className='w-full px-4 py-3 bg-muted border border-border rounded-[var(--radius-input)] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary'
              autoFocus
            />
          </div>

          <DialogFooter className='gap-2'>
            <Button
              variant='outline'
              onClick={() => setIsUrlDialogOpen(false)}
              className='rounded-[var(--radius-button)] border-border'
            >
              Cancel
            </Button>
            <Button
              onClick={handleImportFromUrl}
              disabled={!urlInput.trim()}
              className='rounded-[var(--radius-button)] bg-primary text-primary-foreground hover:bg-primary/90'
            >
              <CheckCircle2 className='h-4 w-4 mr-2' />
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Jira Import Dialog */}
      <Dialog open={isJiraDialogOpen} onOpenChange={setIsJiraDialogOpen}>
        <DialogContent className='bg-card border-border rounded-[var(--radius-card)] max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='text-foreground flex items-center gap-2'>
              <div className='h-8 w-8 rounded-[var(--radius-button)] bg-accent/10 border border-accent/20 flex items-center justify-center p-1.5'>
                <Jira1 />
              </div>
              Import from Jira
            </DialogTitle>
            <DialogDescription className='text-muted-foreground'>
              Enter the Jira ticket ID or URL to import requirements.
            </DialogDescription>
          </DialogHeader>

          <div className='py-4'>
            <input
              type='text'
              value={jiraInput}
              onChange={(e) => setJiraInput(e.target.value)}
              placeholder='PROJ-123 or https://jira.company.com/browse/PROJ-123'
              className='w-full px-4 py-3 bg-muted border border-border rounded-[var(--radius-input)] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary'
              autoFocus
            />
          </div>

          <DialogFooter className='gap-2'>
            <Button
              variant='outline'
              onClick={() => setIsJiraDialogOpen(false)}
              className='rounded-[var(--radius-button)] border-border'
            >
              Cancel
            </Button>
            <Button
              onClick={handleImportFromJira}
              disabled={!jiraInput.trim()}
              className='rounded-[var(--radius-button)] bg-primary text-primary-foreground hover:bg-primary/90'
            >
              <CheckCircle2 className='h-4 w-4 mr-2' />
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* GitHub Import Dialog */}
      <Dialog open={isGitHubDialogOpen} onOpenChange={setIsGitHubDialogOpen}>
        <DialogContent className='bg-card border-border rounded-[var(--radius-card)] max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='text-foreground flex items-center gap-2'>
              <div className='h-8 w-8 rounded-[var(--radius-button)] bg-purple/10 border border-purple/20 flex items-center justify-center p-1.5'>
                <GitHub1 />
              </div>
              Import from GitHub
            </DialogTitle>
            <DialogDescription className='text-muted-foreground'>
              Enter the GitHub repository URL or path to import.
            </DialogDescription>
          </DialogHeader>

          <div className='py-4'>
            <input
              type='text'
              value={gitHubInput}
              onChange={(e) => setGitHubInput(e.target.value)}
              placeholder='https://github.com/username/repo or username/repo'
              className='w-full px-4 py-3 bg-muted border border-border rounded-[var(--radius-input)] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary'
              autoFocus
            />
          </div>

          <DialogFooter className='gap-2'>
            <Button
              variant='outline'
              onClick={() => setIsGitHubDialogOpen(false)}
              className='rounded-[var(--radius-button)] border-border'
            >
              Cancel
            </Button>
            <Button
              onClick={handleImportFromGitHub}
              disabled={!gitHubInput.trim()}
              className='rounded-[var(--radius-button)] bg-primary text-primary-foreground hover:bg-primary/90'
            >
              <CheckCircle2 className='h-4 w-4 mr-2' />
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
