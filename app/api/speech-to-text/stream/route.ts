import { NextRequest, NextResponse } from "next/server";

// Interface for streaming response
interface StreamChunk {
  type: "partial" | "final" | "error" | "start" | "end";
  text?: string;
  confidence?: number;
  timestamp?: number;
  duration?: number;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      language = "en",
      sampleRate = 16000,
      format = "webm",
    } = await request.json();

    // Create a readable stream for real-time processing
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({
              type: "start",
              message: "Speech-to-text stream started",
              timestamp: Date.now(),
            } as StreamChunk)}\n\n`
          )
        );
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Streaming API error:", error);
    return NextResponse.json(
      { error: "Failed to initialize speech-to-text stream" },
      { status: 500 }
    );
  }
}

// WebSocket-like endpoint for real-time audio streaming
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get("language") || "en";
  const model = searchParams.get("model") || "whisper-1";

  // Create Server-Sent Events stream
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const initialMessage: StreamChunk = {
        type: "start",
        text: "Connected to real-time speech-to-text service",
        timestamp: Date.now(),
      };

      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(initialMessage)}\n\n`)
      );

      // Simulate real-time transcription updates
      let counter = 0;
      const interval = setInterval(() => {
        counter++;

        if (counter <= 5) {
          const partialMessage: StreamChunk = {
            type: "partial",
            text: `Listening for speech... ${counter}`,
            confidence: 0.8 + counter * 0.04,
            timestamp: Date.now(),
          };

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(partialMessage)}\n\n`)
          );
        } else if (counter === 6) {
          const finalMessage: StreamChunk = {
            type: "final",
            text: "Real-time transcription ready",
            confidence: 0.95,
            timestamp: Date.now(),
            duration: 5000,
          };

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(finalMessage)}\n\n`)
          );
        } else {
          clearInterval(interval);
          const endMessage: StreamChunk = {
            type: "end",
            text: "Stream ended",
            timestamp: Date.now(),
          };

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(endMessage)}\n\n`)
          );

          controller.close();
        }
      }, 1000);

      // Cleanup on abort
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
