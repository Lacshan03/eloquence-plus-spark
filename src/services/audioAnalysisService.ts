
import { AudioAnalysis } from '@/components/AudioAnalyzer';
import { WordSuggestion } from '@/components/VocabularySuggestions';

// This is a mock service that simulates API calls to the backend
// In a real application, this would make actual API calls to your backend

export async function analyzeAudio(audioBlob: Blob): Promise<{
  analysis: AudioAnalysis;
  suggestions: WordSuggestion[];
}> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Generate mock analysis data
  // In a real application, this would come from your backend after processing with Whisper API and GPT-4
  
  const mockTranscript = "Bonjour, je vous présente aujourd'hui mon parcours professionnel. J'ai travaillé pendant plusieurs années dans le domaine du marketing digital où j'ai pu développer mes compétences en stratégie de contenu et analyse de données. J'ai aussi eu l'opportunité de travailler sur des projets importants qui ont vraiment eu un impact positif sur les résultats de l'entreprise.";
  
  const mockAnalysis: AudioAnalysis = {
    score: 78,
    transcript: mockTranscript,
    metrics: [
      { name: "Fluidité", value: 82, color: "#38B2AC" },
      { name: "Vocabulaire", value: 74, color: "#ED8936" },
      { name: "Grammaire", value: 85, color: "#9F7AEA" },
      { name: "Rythme", value: 70 },
    ]
  };
  
  const mockSuggestions: WordSuggestion[] = [
    { 
      original: "plusieurs années", 
      suggestion: "de nombreuses années", 
      reason: "Expression plus soutenue et précise" 
    },
    { 
      original: "travailler sur", 
      suggestion: "mener à bien", 
      reason: "Verbe d'action plus valorisant" 
    },
    { 
      original: "vraiment", 
      suggestion: "considérablement", 
      reason: "Adverbe plus soutenu" 
    },
    { 
      original: "important", 
      suggestion: "significatif", 
      reason: "Adjectif plus précis et élégant" 
    },
    { 
      original: "impact positif", 
      suggestion: "influence bénéfique", 
      reason: "Expression plus recherchée" 
    }
  ];
  
  // In a real implementation, you would process the audio with Whisper API and then analyze the transcript with GPT-4
  
  return { analysis: mockAnalysis, suggestions: mockSuggestions };
}
