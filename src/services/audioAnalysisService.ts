
import { AudioAnalysis } from '@/components/AudioAnalyzer';
import { WordSuggestion } from '@/components/VocabularySuggestions';

// This is a mock service that simulates API calls to the backend
// In a real application, this would make actual API calls to your backend

// Helper function to generate a random number within a range
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to get a random sample from an array
function getRandomSample<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function analyzeAudio(audioBlob: Blob): Promise<{
  analysis: AudioAnalysis;
  suggestions: WordSuggestion[];
}> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate random score between 65 and 95
  const overallScore = getRandomNumber(65, 95);
  
  // Generate random metrics that are close to the overall score
  const fluidityScore = getRandomNumber(Math.max(60, overallScore - 10), Math.min(98, overallScore + 10));
  const vocabularyScore = getRandomNumber(Math.max(60, overallScore - 15), Math.min(98, overallScore + 5));
  const grammarScore = getRandomNumber(Math.max(65, overallScore - 5), Math.min(98, overallScore + 15));
  const rhythmScore = getRandomNumber(Math.max(60, overallScore - 12), Math.min(98, overallScore + 8));
  
  // Array of possible mock transcripts
  const possibleTranscripts = [
    "Bonjour, je vous présente aujourd'hui mon parcours professionnel. J'ai travaillé pendant plusieurs années dans le domaine du marketing digital où j'ai pu développer mes compétences en stratégie de contenu et analyse de données.",
    "Je souhaiterais aborder la question de l'impact environnemental des entreprises. Il est crucial de mettre en place des pratiques durables pour préserver notre planète et assurer un avenir viable pour les générations futures.",
    "La communication est un élément essentiel dans toute organisation. Elle permet de faciliter les échanges entre les différentes parties prenantes et d'optimiser les processus de décision collective.",
    "L'innovation technologique représente un enjeu majeur pour la compétitivité des entreprises. Il est nécessaire d'investir continuellement dans la recherche et le développement pour rester pertinent sur le marché.",
    "Je me permets de partager mon analyse concernant l'évolution du secteur économique ces dernières années. Plusieurs facteurs ont contribué à transformer radicalement notre approche des modèles d'affaires traditionnels."
  ];
  
  // Select a random transcript
  const selectedTranscript = possibleTranscripts[Math.floor(Math.random() * possibleTranscripts.length)];
  
  // Create the analysis object
  const mockAnalysis: AudioAnalysis = {
    score: overallScore,
    transcript: selectedTranscript,
    metrics: [
      { name: "Fluidité", value: fluidityScore, color: "#38B2AC" },
      { name: "Vocabulaire", value: vocabularyScore, color: "#ED8936" },
      { name: "Grammaire", value: grammarScore, color: "#9F7AEA" },
      { name: "Rythme", value: rhythmScore, color: "#F687B3" },
    ]
  };
  
  // Pool of possible word suggestions
  const suggestionPool: WordSuggestion[] = [
    { original: "plusieurs années", suggestion: "de nombreuses années", reason: "Expression plus soutenue et précise" },
    { original: "travailler sur", suggestion: "mener à bien", reason: "Verbe d'action plus valorisant" },
    { original: "vraiment", suggestion: "considérablement", reason: "Adverbe plus soutenu" },
    { original: "important", suggestion: "significatif", reason: "Adjectif plus précis et élégant" },
    { original: "impact positif", suggestion: "influence bénéfique", reason: "Expression plus recherchée" },
    { original: "beaucoup", suggestion: "substantiellement", reason: "Terme plus précis et élaboré" },
    { original: "bon", suggestion: "favorable", reason: "Adjectif plus nuancé" },
    { original: "dire", suggestion: "exprimer", reason: "Verbe plus précis et soutenu" },
    { original: "grand", suggestion: "considérable", reason: "Adjectif plus élaboré" },
    { original: "penser", suggestion: "estimer", reason: "Verbe d'opinion plus formel" },
    { original: "mettre en place", suggestion: "implémenter", reason: "Terme plus technique et précis" },
    { original: "regarder", suggestion: "examiner", reason: "Verbe plus analytique" },
    { original: "problème", suggestion: "problématique", reason: "Terme plus académique" },
    { original: "parler de", suggestion: "aborder", reason: "Verbe plus structuré et formel" },
    { original: "changer", suggestion: "transformer", reason: "Verbe plus impactant" }
  ];
  
  // Select 3-5 random suggestions
  const numberOfSuggestions = getRandomNumber(3, 5);
  const mockSuggestions = getRandomSample(suggestionPool, numberOfSuggestions);
  
  return { analysis: mockAnalysis, suggestions: mockSuggestions };
}
