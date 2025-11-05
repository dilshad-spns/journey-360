// Speech-to-Text API Client for real-time streaming
export class SpeechToTextClient {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private stream: MediaStream | null = null;
  private eventSource: EventSource | null = null;
  private websocket: WebSocket | null = null;

  constructor(
    private onTranscription: (text: string, isFinal: boolean) => void,
    private onError: (error: string) => void,
    private options: {
      language?: string;
      sampleRate?: number;
      chunkDuration?: number; // Duration in ms for each audio chunk
      apiEndpoint?: string;
      useWebSocket?: boolean;
    } = {}
  ) {
    this.options = {
      language: "en",
      sampleRate: 16000,
      chunkDuration: 1000, // 1 second chunks
      apiEndpoint: "/api/speech-to-text",
      useWebSocket: false,
      ...options,
    };
  }

  async startRecording(): Promise<void> {
    try {
      // Get user media
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: this.options.sampleRate,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Initialize MediaRecorder
      const mimeType = this.getSupportedMimeType();
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });

      this.audioChunks = [];

      // Handle data available
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          this.processAudioChunk(event.data);
        }
      };

      // Handle recording stop
      this.mediaRecorder.onstop = () => {
        this.processFullRecording();
      };

      // Handle errors
      this.mediaRecorder.onerror = (event) => {
        this.onError(
          `MediaRecorder error: ${event.error?.message || "Unknown error"}`
        );
      };

      // Start recording with time slices
      this.mediaRecorder.start(this.options.chunkDuration);
      this.isRecording = true;

      // Initialize streaming connection if using WebSocket
      if (this.options.useWebSocket) {
        this.initializeWebSocketConnection();
      } else {
        this.initializeServerSentEvents();
      }
    } catch (error) {
      this.onError(
        `Failed to start recording: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    this.closeConnections();
  }

  private getSupportedMimeType(): string {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/wav",
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return "audio/webm"; // Fallback
  }

  private async processAudioChunk(chunk: Blob): Promise<void> {
    if (!this.options.useWebSocket) {
      // For HTTP API, send chunk for processing
      await this.sendAudioChunk(chunk);
    }
  }

  private async sendAudioChunk(audioBlob: Blob): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, `chunk_${Date.now()}.webm`);
      formData.append("language", this.options.language || "en");
      formData.append("isChunk", "true");

      const response = await fetch(this.options.apiEndpoint!, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.transcription) {
        this.onTranscription(result.transcription, false); // Partial result
      }
    } catch (error) {
      console.error("Error sending audio chunk:", error);
      // Don't call onError for chunk errors to avoid interrupting the stream
    }
  }

  private processFullRecording(): void {
    if (this.audioChunks.length === 0) return;

    const fullAudioBlob = new Blob(this.audioChunks, {
      type: this.getSupportedMimeType(),
    });

    this.sendFinalAudio(fullAudioBlob);
  }

  private async sendFinalAudio(audioBlob: Blob): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, `recording_${Date.now()}.webm`);
      formData.append("language", this.options.language || "en");
      formData.append("isFinal", "true");

      const response = await fetch(this.options.apiEndpoint!, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.transcription) {
        this.onTranscription(result.transcription, true); // Final result
      }
    } catch (error) {
      this.onError(
        `Failed to process final recording: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private initializeServerSentEvents(): void {
    const url = new URL(
      `${this.options.apiEndpoint}/stream`,
      window.location.origin
    );
    url.searchParams.set("language", this.options.language || "en");

    this.eventSource = new EventSource(url.toString());

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "partial":
            this.onTranscription(data.text, false);
            break;
          case "final":
            this.onTranscription(data.text, true);
            break;
          case "error":
            this.onError(data.error);
            break;
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      this.onError("Lost connection to speech-to-text service");
    };
  }

  private initializeWebSocketConnection(): void {
    // WebSocket implementation for real-time streaming
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${window.location.host}${this.options.apiEndpoint}/ws`;

    this.websocket = new WebSocket(wsUrl);

    this.websocket.onopen = () => {
      console.log("WebSocket connected for speech-to-text");

      // Send configuration
      this.websocket?.send(
        JSON.stringify({
          type: "config",
          language: this.options.language,
          sampleRate: this.options.sampleRate,
        })
      );
    };

    this.websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "partial":
            this.onTranscription(data.text, false);
            break;
          case "final":
            this.onTranscription(data.text, true);
            break;
          case "error":
            this.onError(data.error);
            break;
        }
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    this.websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.onError("WebSocket connection failed");
    };

    this.websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }

  private closeConnections(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  // Public methods
  public isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  public getRecordingDuration(): number {
    return this.audioChunks.length * (this.options.chunkDuration || 1000);
  }

  public async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.options.apiEndpoint!);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Utility function to create a speech-to-text client
export function createSpeechToTextClient(
  onTranscription: (text: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  options?: {
    language?: string;
    sampleRate?: number;
    chunkDuration?: number;
    apiEndpoint?: string;
    useWebSocket?: boolean;
  }
): SpeechToTextClient {
  return new SpeechToTextClient(onTranscription, onError, options);
}
