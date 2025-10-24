import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GEMINI_API_KEY = "AIzaSyCAX6DwNjQRHu2DzBmYdnrVUENLCs8lYIE";

interface ImageRequest {
  prompt: string;
  sourceImage?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { prompt, sourceImage }: ImageRequest = await req.json();

    const parts: any[] = [{ text: prompt }];
    
    if (sourceImage) {
      parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: sourceImage
        }
      });
      parts.push({ text: "Based on this image, generate a detailed description for creating a similar or modified image." });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: parts
          }]
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to generate image description");
    }

    const description = data.candidates[0]?.content?.parts[0]?.text || "Unable to generate description.";

    return new Response(
      JSON.stringify({ 
        description,
        message: "Image generation simulated. In production, this would connect to an image generation API like DALL-E or Imagen."
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});