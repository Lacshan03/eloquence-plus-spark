
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.20.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Database } from "../_shared/database.types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configure external services
const openAiKey = Deno.env.get('OPENAI_API_KEY') || '';
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Initialize clients
const openai = new OpenAI({ apiKey: openAiKey });
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

/**
 * Analyses a transcription using GPT to extract metrics and suggestions
 */
async function analyzeWithGPT(transcript: string) {
  try {
    // Use GPT-4o Mini for advanced linguistic analysis
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Tu es un expert en linguistique française et en éloquence. 
          Analyse le texte fourni et évalue-le sur ces 4 critères (note de 0 à 100):
          - Fluidité (rythme, absence d'hésitations)
          - Vocabulaire (richesse, précision, registre)
          - Grammaire (syntaxe, conjugaisons)
          - Rythme (cadence, pauses appropriées)
          
          Génère ensuite 3 à 7 suggestions d'amélioration lexicale avec:
          - Le mot/expression original à remplacer
          - Le mot/expression suggéré pour l'amélioration
          - Une brève explication de cette amélioration
          
          Enfin, rédige un feedback global constructif de 2-3 phrases sur la qualité d'expression.
          
          Réponds UNIQUEMENT au format JSON suivant sans aucun texte supplémentaire:
          {
            "score_fluidite": [0-100],
            "score_vocabulaire": [0-100],
            "score_grammaire": [0-100],
            "score_rythme": [0-100],
            "substitutions": [
              {"original": "mot original", "suggestion": "amélioration", "raison": "explication"}
            ],
            "feedback": "feedback global"
          }`
        },
        {
          role: "user",
          content: transcript
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    // Parse and return the GPT response
    const analysisText = response.choices[0].message.content;
    if (!analysisText) {
      throw new Error("Empty response from GPT");
    }
    
    const analysis = JSON.parse(analysisText);
    
    // Calculate overall score (weighted average)
    const overallScore = Math.round(
      (analysis.score_fluidite * 0.25) +
      (analysis.score_vocabulaire * 0.3) +
      (analysis.score_grammaire * 0.25) +
      (analysis.score_rythme * 0.2)
    );
    
    return { ...analysis, overall_score: overallScore };
  } catch (error) {
    console.error("Error analyzing with GPT:", error);
    throw error;
  }
}

/**
 * Fallback analysis when GPT analysis fails
 */
function fallbackAnalysis(transcript: string) {
  // Simple analysis based on text length and complexity
  const words = transcript.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / wordCount;
  
  // Generate base scores
  const fluidityScore = Math.min(85, Math.max(60, wordCount / 2));
  const vocabScore = Math.min(80, Math.max(65, avgWordLength * 10));
  const grammarScore = Math.min(85, Math.max(70, (wordCount > 50 ? 80 : 70)));
  const rhythmScore = Math.min(80, Math.max(65, wordCount / 3));
  
  // Calculate overall score
  const overallScore = Math.round(
    (fluidityScore * 0.25) +
    (vocabScore * 0.3) +
    (grammarScore * 0.25) +
    (rhythmScore * 0.2)
  );
  
  return {
    score_fluidite: Math.round(fluidityScore),
    score_vocabulaire: Math.round(vocabScore),
    score_grammaire: Math.round(grammarScore),
    score_rythme: Math.round(rhythmScore),
    overall_score: overallScore,
    substitutions: [
      {
        original: "très",
        suggestion: "extrêmement",
        raison: "Enrichissement du vocabulaire avec un adverbe plus précis"
      },
      {
        original: "chose",
        suggestion: "élément",
        raison: "Utilisation d'un terme plus spécifique et formel"
      }
    ],
    feedback: "Votre expression est de qualité moyenne. Essayez d'enrichir votre vocabulaire et de varier vos tournures de phrases pour gagner en éloquence."
  };
}

/**
 * Loads vocabulary suggestions from a CSV file in storage
 */
async function loadVocabularyData() {
  try {
    const { data, error } = await supabase
      .storage
      .from('vocabulaire')
      .list();
    
    if (error) {
      console.error("Error loading vocabulary data:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in loadVocabularyData:", error);
    return [];
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse the request body
    const { audioUrl, enregistrementId } = await req.json();
    
    if (!audioUrl || !enregistrementId) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required parameters" }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // 1. Retrieve the audio file's public URL
    const { data: publicUrlData } = await supabase
      .storage
      .from('audio_recordings')
      .getPublicUrl(audioUrl);
    
    if (!publicUrlData.publicUrl) {
      return new Response(
        JSON.stringify({ success: false, error: "Could not get audio URL" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // 2. Generate transcript using Whisper API
    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
      },
      body: (() => {
        const formData = new FormData();
        formData.append('file', publicUrlData.publicUrl);
        formData.append('model', 'whisper-1');
        formData.append('language', 'fr');
        formData.append('response_format', 'json');
        return formData;
      })(),
    });
    
    if (!transcriptionResponse.ok) {
      console.error("Whisper API error:", await transcriptionResponse.text());
      return new Response(
        JSON.stringify({ success: false, error: "Failed to transcribe audio" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const transcription = await transcriptionResponse.json();
    const transcript = transcription.text;
    
    // 3. Analyze the transcript
    let analysis;
    try {
      analysis = await analyzeWithGPT(transcript);
    } catch (error) {
      console.warn("GPT analysis failed, using fallback:", error);
      analysis = fallbackAnalysis(transcript);
    }
    
    // 4. Update the enregistrement with transcript and score
    await supabase
      .from('enregistrements')
      .update({ 
        transcript: transcript,
        score_eloquence: analysis.overall_score
      })
      .eq('id', enregistrementId);
    
    // 5. Save the analysis
    await supabase
      .from('analyses_eloquence')
      .insert({
        enregistrement_id: enregistrementId,
        score_fluidite: analysis.score_fluidite,
        score_vocabulaire: analysis.score_vocabulaire,
        score_grammaire: analysis.score_grammaire,
        score_rythme: analysis.score_rythme,
        substitutions: analysis.substitutions,
        feedback: analysis.feedback
      });
    
    // 6. Prepare response with metrics and suggestions
    const responseData = {
      success: true,
      analysis: {
        score: analysis.overall_score,
        transcript: transcript,
        metrics: [
          { name: "Fluidité", value: analysis.score_fluidite, color: "#38B2AC" },
          { name: "Vocabulaire", value: analysis.score_vocabulaire, color: "#ED8936" },
          { name: "Grammaire", value: analysis.score_grammaire, color: "#9F7AEA" },
          { name: "Rythme", value: analysis.score_rythme, color: "#F687B3" },
        ]
      },
      suggestions: analysis.substitutions
    };
    
    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error in analyser-audio function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
