
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Supabase client setup function
const getSupabaseClient = (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Authorization header is required');
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });
};

// Analyse détaillée du texte avec OpenAI
async function analyzeTextWithGPT(transcript: string) {
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiApiKey) {
    throw new Error("Clé API OpenAI non configurée");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Tu es un expert en analyse d'éloquence française. Analyse le discours fourni et évalue ces critères:
              1. Fluidité (note /100): évaluer la fluidité, le débit de parole, l'absence d'hésitations
              2. Vocabulaire (note /100): richesse lexicale, précision des termes, absence de familiarités
              3. Grammaire (note /100): correction syntaxique, conjugaisons, phrases bien construites
              4. Rythme (note /100): prosodie, variations de ton, expressivité
              
              Identifie également jusqu'à 5 expressions ou mots qui pourraient être améliorés, avec une suggestion
              plus soutenue pour chacun et la raison de ce changement.
              
              Donne aussi un court feedback général (2-3 phrases maximum).
              
              Réponds UNIQUEMENT au format JSON suivant:
              {
                "score_fluidite": <nombre>,
                "score_vocabulaire": <nombre>,
                "score_grammaire": <nombre>,
                "score_rythme": <nombre>,
                "substitutions": [{"original": "...", "suggestion": "...", "raison": "..."}],
                "feedback": "..."
              }`
          },
          {
            role: "user",
            content: transcript
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur OpenAI: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return JSON.parse(result.choices[0].message.content);
  } catch (error) {
    console.error("Erreur lors de l'analyse GPT:", error);
    throw error;
  }
}

// Calculate metrics based on transcript analysis
const calculateMetrics = (transcript: string, substitutions: any[]) => {
  // Basic metrics calculation
  // In a real implementation, this would be more sophisticated
  const words = transcript.toLowerCase().split(/\s+/).filter(Boolean);
  const uniqueWords = new Set(words);
  
  // Calculate vocabulary score (percentage of substitutions relative to total words)
  const vocabularyScore = Math.min(
    100, 
    Math.round(70 + (substitutions.length / words.length) * 100)
  );
  
  // Estimate sentence length and variation for fluidity score
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 
    ? words.length / sentences.length 
    : 0;
  
  // Higher fluidity for moderate sentence length (not too short, not too long)
  let fluidityScore = 75;
  if (avgSentenceLength > 5 && avgSentenceLength < 15) {
    fluidityScore += 10;
  } else if (avgSentenceLength > 3 && avgSentenceLength < 20) {
    fluidityScore += 5;
  }
  
  // Grammar score (using a placeholder - would normally use NLP tools)
  const grammarScore = 80;
  
  // Rhythm score based on word variation
  const rhythmScore = Math.min(
    100,
    Math.round(70 + (uniqueWords.size / words.length) * 30)
  );
  
  // Overall eloquence score (weighted average)
  const overallScore = Math.round(
    (vocabularyScore * 0.35) +
    (fluidityScore * 0.3) +
    (grammarScore * 0.25) +
    (rhythmScore * 0.1)
  );
  
  return {
    score: Math.min(100, Math.max(0, overallScore)),
    metrics: [
      { name: "Fluidité", value: fluidityScore, color: "#38B2AC" },
      { name: "Vocabulaire", value: vocabularyScore, color: "#ED8936" },
      { name: "Grammaire", value: grammarScore, color: "#9F7AEA" },
      { name: "Rythme", value: rhythmScore, color: "#F687B3" },
    ]
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Get the request data
    const { audioUrl, enregistrementId } = await req.json();
    
    if (!audioUrl || !enregistrementId) {
      throw new Error("URL audio et ID d'enregistrement sont requis");
    }

    // Get the OpenAI API key from environment variables
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("Clé API OpenAI non configurée");
    }

    // Initialize Supabase client
    const supabase = getSupabaseClient(req);
    
    // Get the audio file from storage
    const { data: audioData, error: audioError } = await supabase
      .storage
      .from('audio_recordings')
      .download(audioUrl);
    
    if (audioError || !audioData) {
      throw new Error(`Erreur lors de la récupération du fichier audio: ${audioError?.message || "Fichier non trouvé"}`);
    }

    // Prepare form data for OpenAI API
    const formData = new FormData();
    formData.append("file", audioData, "audio.mp3");
    formData.append("model", "whisper-1");
    formData.append("language", "fr");
    
    // Call OpenAI API for transcription
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error (transcription): ${error}`);
    }

    // Get the transcript from OpenAI
    const transcriptionResult = await response.json();
    const transcript = transcriptionResult.text;

    // Analyse avancée avec GPT
    let nlpAnalysis;
    try {
      nlpAnalysis = await analyzeTextWithGPT(transcript);
      console.log("NLP Analysis result:", JSON.stringify(nlpAnalysis));
    } catch (error) {
      console.error("Erreur lors de l'analyse NLP:", error);
      // En cas d'erreur, utiliser notre méthode de calcul de métriques de secours
      const { data: motsAmeliores, error: dbError } = await supabase
        .from("mots_ameliores")
        .select("mot_original, mot_ameliore, raison");
      
      if (dbError) {
        throw new Error(`Erreur de base de données: ${dbError.message}`);
      }

      // Find words to improve
      const substitutions = [];
      const words = transcript.toLowerCase().match(/\b\w+\b/g) || [];
      const wordMap = new Map();
      
      motsAmeliores?.forEach(item => {
        wordMap.set(item.mot_original.toLowerCase(), {
          suggestion: item.mot_ameliore,
          reason: item.raison || "Expression plus soutenue et précise"
        });
      });

      words.forEach(word => {
        if (wordMap.has(word)) {
          const { suggestion, reason } = wordMap.get(word);
          substitutions.push({
            original: word,
            suggestion,
            reason
          });
        }
      });

      // Calculate metrics using fallback method
      const analysisResult = calculateMetrics(transcript, substitutions);
      nlpAnalysis = {
        score_fluidite: analysisResult.metrics.find(m => m.name === "Fluidité")?.value || 75,
        score_vocabulaire: analysisResult.metrics.find(m => m.name === "Vocabulaire")?.value || 70,
        score_grammaire: analysisResult.metrics.find(m => m.name === "Grammaire")?.value || 80,
        score_rythme: analysisResult.metrics.find(m => m.name === "Rythme")?.value || 75,
        substitutions: substitutions,
        feedback: "Analyse automatique basée sur les métriques extraites"
      };
    }

    // Calculate overall score (weighted average)
    const overallScore = Math.round(
      (nlpAnalysis.score_vocabulaire * 0.35) +
      (nlpAnalysis.score_fluidite * 0.3) +
      (nlpAnalysis.score_grammaire * 0.25) +
      (nlpAnalysis.score_rythme * 0.1)
    );

    // Update the enregistrement with the transcript and score
    await supabase
      .from("enregistrements")
      .update({
        transcript: transcript,
        score_eloquence: overallScore
      })
      .eq("id", enregistrementId);

    // Store detailed analysis
    await supabase
      .from("analyses_eloquence")
      .insert({
        enregistrement_id: enregistrementId,
        score_fluidite: nlpAnalysis.score_fluidite,
        score_vocabulaire: nlpAnalysis.score_vocabulaire,
        score_grammaire: nlpAnalysis.score_grammaire,
        score_rythme: nlpAnalysis.score_rythme,
        substitutions: nlpAnalysis.substitutions,
        feedback: nlpAnalysis.feedback
      });

    // Return the results
    return new Response(
      JSON.stringify({
        success: true,
        analysis: {
          transcript,
          score: overallScore,
          metrics: [
            { name: "Fluidité", value: nlpAnalysis.score_fluidite, color: "#38B2AC" },
            { name: "Vocabulaire", value: nlpAnalysis.score_vocabulaire, color: "#ED8936" },
            { name: "Grammaire", value: nlpAnalysis.score_grammaire, color: "#9F7AEA" },
            { name: "Rythme", value: nlpAnalysis.score_rythme, color: "#F687B3" },
          ]
        },
        suggestions: nlpAnalysis.substitutions
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
