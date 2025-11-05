import { NextRequest, NextResponse } from "next/server";

// Azure Speech Service configuration
const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || "eastus";
const AZURE_SPEECH_ENDPOINT = process.env.AZURE_SPEECH_ENDPOINT; //`https://${AZURE_SPEECH_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`;

// Helper function to convert audio file to supported format for Azure
async function convertAudioForAzure(audioFile: File): Promise<ArrayBuffer> {
  const arrayBuffer = await audioFile.arrayBuffer();

  // Azure Speech Service supports WAV, MP3, OGG, FLAC, and other formats
  // For WebM files, we'll send as-is and let Azure handle the conversion
  return arrayBuffer;
}

// Helper function to call Azure Speech-to-Text API
async function callAzureSpeechAPI(
  audioBuffer: ArrayBuffer,
  language: string,
  audioFormat: string
): Promise<any> {
  if (!AZURE_SPEECH_KEY) {
    throw new Error("Azure Speech Service key not configured");
  }

  const params = new URLSearchParams({
    language: language,
    format: "detailed",
    profanity: "masked",
  });

  const response = await fetch(`${AZURE_SPEECH_ENDPOINT}?${params}`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY,
      "Content-Type": `audio/${audioFormat === "webm" ? "webm" : "wav"}`,
      Accept: "application/json",
    },
    body: audioBuffer,
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Azure Speech API error: ${response.status} - ${errorText}`
    );
  }

  return await response.json();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const language = (formData.get("language") as string) || "en";
    const model = (formData.get("model") as string) || "whisper-1";

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "audio/wav",
      "audio/mp3",
      "audio/m4a",
      "audio/webm",
      "audio/ogg",
    ];
    console.log("audioFile.type===>", audioFile.type);
    if (!allowedTypes.includes(audioFile.type)) {
      return NextResponse.json(
        {
          error:
            "Unsupported audio format. Supported formats: WAV, MP3, M4A, WebM, OGG",
        },
        { status: 400 }
      );
    }
    console.log("audioFile.size===>", audioFile.size);
    // Check file size (OpenAI Whisper has a 25MB limit)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: "Audio file too large. Maximum size is 25MB" },
        { status: 400 }
      );
    }

    console.log(
      `Processing audio file: ${audioFile.name}, size: ${audioFile.size} bytes, type: ${audioFile.type}`
    );

    // Convert audio file for Azure Speech Service
    const audioBuffer = await convertAudioForAzure(audioFile);
    console.log("audioBuffer===>", audioBuffer);
    // Extract audio format from MIME type
    const audioFormat = audioFile.type.split("/")[1] || "wav";

    // Map language codes to Azure format (e.g., 'en' -> 'en-US')
    const azureLanguage =
      language === "en"
        ? "en-US"
        : language === "es"
        ? "es-ES"
        : language === "fr"
        ? "fr-FR"
        : language === "de"
        ? "de-DE"
        : language === "it"
        ? "it-IT"
        : language === "pt"
        ? "pt-BR"
        : language === "ru"
        ? "ru-RU"
        : language === "ja"
        ? "ja-JP"
        : language === "ko"
        ? "ko-KR"
        : language === "zh"
        ? "zh-CN"
        : "en-US"; // Default to en-US

    // Call Azure Speech-to-Text API
    const azureResult = await callAzureSpeechAPI(
      audioBuffer,
      azureLanguage,
      audioFormat
    );

    // Parse Azure response format
    const bestMatch = azureResult.NBest?.[0] || {};
    const transcriptionText =
      bestMatch.Display || bestMatch.Lexical || "No transcription available";
    const confidence = bestMatch.Confidence || 0;

    // Convert Azure words format to match expected format
    const words =
      bestMatch.Words?.map((word: any, index: number) => ({
        word: word.Word,
        start: word.Offset / 10000000, // Convert from ticks to seconds
        end: (word.Offset + word.Duration) / 10000000,
        confidence: word.Confidence || confidence,
      })) || [];

    // Create segments from the full transcription
    const segments = [
      {
        text: transcriptionText,
        start: 0,
        end: azureResult.Duration
          ? azureResult.Duration / 10000000
          : words.length > 0
          ? words[words.length - 1].end
          : 0,
        confidence: confidence,
      },
    ];

    return NextResponse.json({
      success: true,
      transcription: transcriptionText,
      language: azureLanguage,
      duration: azureResult.Duration ? azureResult.Duration / 10000000 : 0,
      confidence: confidence,
      words: words,
      segments: segments,
      metadata: {
        provider: "azure-speech",
        model: "azure-stt",
        inputLanguage: language,
        azureLanguage: azureLanguage,
        fileSize: audioFile.size,
        fileName: audioFile.name,
        timestamp: new Date().toISOString(),
        recognitionStatus: azureResult.RecognitionStatus,
      },
    });
  } catch (error: any) {
    console.error("Speech-to-text API error:", error);

    // Handle specific Azure Speech Service errors
    if (
      error.message?.includes("invalid_api_key") ||
      error.message?.includes("401")
    ) {
      return NextResponse.json(
        { error: "Invalid Azure Speech Service key" },
        { status: 401 }
      );
    }

    if (error.message?.includes("quota") || error.message?.includes("429")) {
      return NextResponse.json(
        {
          error: "Azure Speech Service quota exceeded. Please try again later.",
        },
        { status: 429 }
      );
    }

    if (
      error.message?.includes("unsupported") ||
      error.message?.includes("400")
    ) {
      return NextResponse.json(
        {
          error:
            "Unsupported audio format or invalid request to Azure Speech Service",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Speech-to-text processing failed",
        details: error.message,
        provider: "azure-speech",
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const isConfigured = Boolean(AZURE_SPEECH_KEY);

  return NextResponse.json({
    status: isConfigured ? "ok" : "configuration_required",
    provider: "azure-speech",
    service: "speech-to-text",
    timestamp: new Date().toISOString(),
    region: AZURE_SPEECH_REGION,
    configured: isConfigured,
    supportedFormats: [
      "audio/wav",
      "audio/mp3",
      "audio/m4a",
      "audio/webm",
      "audio/ogg",
      "audio/flac",
    ],
    maxFileSize: "25MB",
    models: ["azure-stt"],
    languages: [
      "en-US",
      "es-ES",
      "fr-FR",
      "de-DE",
      "it-IT",
      "pt-BR",
      "ru-RU",
      "ja-JP",
      "ko-KR",
      "zh-CN",
      "ar-SA",
      "hi-IN",
      "nl-NL",
      "sv-SE",
      "da-DK",
      "no-NO",
      "fi-FI",
      "pl-PL",
      "tr-TR",
    ],
    endpoint: AZURE_SPEECH_ENDPOINT,
    requiresKey: !isConfigured,
  });
}
