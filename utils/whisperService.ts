/**
 * Azure OpenAI Whisper Speech-to-Text Service
 * Handles audio recording and transcription using Azure OpenAI Whisper API
 */

export interface WhisperConfig {
  apiKey: string;
  endpoint: string;
}

export interface TranscriptionResult {
  text: string;
  success: boolean;
  error?: string;
}

export class WhisperService {
  private config: WhisperConfig;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor(config: WhisperConfig) {
    this.config = config;
  }

  /**
   * Check if browser supports audio recording
   */
  static isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  /**
   * Request microphone permission and start recording
   */
  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: this.getSupportedMimeType()
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Failed to access microphone. Please check permissions.');
    }
  }

  /**
   * Stop recording and return the audio blob
   */
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { 
          type: this.getSupportedMimeType() 
        });
        
        // Stop all tracks
        if (this.mediaRecorder?.stream) {
          this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
        
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Transcribe audio using Azure OpenAI Whisper API
   */
  async transcribe(audioBlob: Blob): Promise<TranscriptionResult> {
    try {
      // Convert blob to the format Whisper expects
      const formData = new FormData();
      
      // Convert to appropriate format if needed
      const audioFile = new File(
        [audioBlob], 
        'audio.webm', 
        { type: audioBlob.type }
      );
      
      formData.append('file', audioFile);

      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'api-key': this.config.apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Whisper API error:', errorText);
        throw new Error(`Transcription failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        text: result.text || '',
        success: true,
      };
    } catch (error) {
      console.error('Transcription error:', error);
      return {
        text: '',
        success: false,
        error: error instanceof Error ? error.message : 'Transcription failed',
      };
    }
  }

  /**
   * Record and transcribe in one operation
   */
  async recordAndTranscribe(durationMs?: number): Promise<TranscriptionResult> {
    await this.startRecording();
    
    if (durationMs) {
      await new Promise(resolve => setTimeout(resolve, durationMs));
      const audioBlob = await this.stopRecording();
      return await this.transcribe(audioBlob);
    }
    
    throw new Error('Duration must be specified for automatic recording');
  }

  /**
   * Check if currently recording
   */
  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }

  /**
   * Cancel current recording
   */
  cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      if (this.mediaRecorder.stream) {
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    }
    this.audioChunks = [];
  }

  /**
   * Get supported MIME type for audio recording
   */
  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'audio/webm'; // fallback
  }
}

/**
 * Create a singleton instance with configuration from environment
 */
export function createWhisperService(): WhisperService {
  const config: WhisperConfig = {
    apiKey: process.env.NEXT_PUBLIC_WHISPER_API_KEY || '2bcd1b58e76740bcb4edeeced69087cd',
    endpoint: process.env.NEXT_PUBLIC_WHISPER_ENDPOINT || 'https://swa-it-openai-idit.openai.azure.com/openai/deployments/whisper/audio/translations?api-version=2024-06-01',
  };

  return new WhisperService(config);
}
