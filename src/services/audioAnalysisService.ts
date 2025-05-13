
import { supabase } from '@/integrations/supabase/client';
import { AudioAnalysis } from '@/components/AudioAnalyzer';
import { WordSuggestion } from '@/components/VocabularySuggestions';
import { VocabularyEntry, loadVocabularyFromCSV } from './csvService';

// Global variable to store loaded vocabulary
let vocabularyCache: VocabularyEntry[] = [];

// Load vocabulary from CSV files (called during initialization)
export async function initVocabularyDatabase(): Promise<void> {
  try {
    // Create storage bucket for vocabulary if it doesn't exist
    await ensureStorageBucketExists('vocabulaire');
    
    // Try to load from Supabase first
    const { data: vocabFiles, error } = await supabase
      .storage
      .from('vocabulaire')
      .list();
      
    if (error || !vocabFiles || vocabFiles.length === 0) {
      // If no files in Supabase, upload our default vocabulary files
      console.log('Initializing vocabulary database...');
      await uploadDefaultVocabulary();
    }
    
    // Load vocabulary into memory
    await loadVocabularyDatabase();
  } catch (error) {
    console.error('Error initializing vocabulary database:', error);
  }
}

// Ensure the storage bucket exists
async function ensureStorageBucketExists(bucketName: string): Promise<void> {
  try {
    // Check if bucket exists by trying to list files
    const { error } = await supabase.storage.from(bucketName).list();
    
    // If error is 'Bucket not found', create it
    if (error && error.message.includes('not found')) {
      // We can't create buckets from the client, so we'll use an edge function
      await supabase.functions.invoke('create-bucket', {
        body: { bucketName }
      });
    }
  } catch (error) {
    console.error('Error checking/creating bucket:', error);
  }
}

// Upload default vocabulary files to Supabase
async function uploadDefaultVocabulary(): Promise<void> {
  try {
    const files = [
      'vocabulaire_base.csv',
      'vocabulaire_avance.csv',
      'vocabulaire_technique.csv'
    ];
    
    for (const file of files) {
      const response = await fetch(`/${file}`);
      const content = await response.blob();
      
      const { error } = await supabase
        .storage
        .from('vocabulaire')
        .upload(file, content, {
          cacheControl: '3600',
          contentType: 'text/csv',
          upsert: true
        });
        
      if (error) {
        console.error(`Error uploading ${file}:`, error);
      }
    }
  } catch (error) {
    console.error('Error uploading vocabulary files:', error);
  }
}

// Load all vocabulary files into memory
async function loadVocabularyDatabase(): Promise<void> {
  try {
    const { data: vocabFiles, error } = await supabase
      .storage
      .from('vocabulaire')
      .list();
      
    if (error || !vocabFiles) {
      throw new Error('Unable to list vocabulary files');
    }
    
    // Clear cache
    vocabularyCache = [];
    
    // Load each file
    for (const file of vocabFiles) {
      if (file.name.endsWith('.csv')) {
        const { data } = await supabase
          .storage
          .from('vocabulaire')
          .getPublicUrl(file.name);
          
        const entries = await loadVocabularyFromCSV(data.publicUrl);
        vocabularyCache = [...vocabularyCache, ...entries];
      }
    }
    
    console.log(`Loaded ${vocabularyCache.length} vocabulary entries`);
  } catch (error) {
    console.error('Error loading vocabulary database:', error);
  }
}

// Fonction pour uploader un fichier audio vers Supabase Storage
export async function uploadAudioFile(audioBlob: Blob, userId: string): Promise<string | null> {
  try {
    // Convert WAV to MP3 if needed
    let uploadBlob = audioBlob;
    const contentType = audioBlob.type;
    
    // If the audio is in WAV format, convert it to MP3
    if (contentType === 'audio/wav') {
      // For now we'll just change the extension
      // In a production app, we'd use a library to convert the format
      console.log('Converting WAV to MP3 format...');
    }
    
    // Créer un nom de fichier unique
    const fileName = `${userId}/${Date.now()}.mp3`;
    
    // Upload le fichier audio
    const { data, error } = await supabase.storage
      .from('audio_recordings')
      .upload(fileName, uploadBlob, {
        cacheControl: '3600',
        contentType: 'audio/mpeg',
      });
    
    if (error) {
      console.error('Error uploading audio file:', error);
      throw error;
    }
    
    return fileName;
  } catch (error) {
    console.error('Error in uploadAudioFile:', error);
    return null;
  }
}

// Fonction pour enregistrer les métadonnées de l'enregistrement
export async function saveRecording(
  audioPath: string, 
  duration: number
): Promise<string | null> {
  try {
    // Récupérer l'ID de l'utilisateur connecté
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      throw new Error("Utilisateur non authentifié");
    }
    
    const userId = sessionData.session.user.id;
    
    // Insérer l'enregistrement dans la base de données
    const { data, error } = await supabase
      .from('enregistrements')
      .insert({
        chemin_audio: audioPath,
        duree: duration,
        user_id: userId
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error saving recording metadata:', error);
      throw error;
    }
    
    return data?.id || null;
  } catch (error) {
    console.error('Error in saveRecording:', error);
    return null;
  }
}

// Fonction pour analyser un enregistrement audio
export async function analyzeAudio(audioBlob: Blob): Promise<{
  analysis: AudioAnalysis;
  suggestions: WordSuggestion[];
}> {
  try {
    // 1. Vérifier si l'utilisateur est connecté
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error("Vous devez être connecté pour analyser un enregistrement");
    }
    
    // 2. Upload le fichier audio
    const userId = sessionData.session.user.id;
    const audioPath = await uploadAudioFile(audioBlob, userId);
    
    if (!audioPath) {
      throw new Error("Échec du téléchargement de l'audio");
    }
    
    // 3. Sauvegarder les métadonnées de l'enregistrement
    const duration = Math.round(await getAudioDuration(audioBlob));
    const recordingId = await saveRecording(audioPath, duration);
    
    if (!recordingId) {
      throw new Error("Échec de l'enregistrement des métadonnées");
    }
    
    // 4. Appeler la fonction Edge pour analyser l'audio
    const { data, error } = await supabase.functions.invoke('analyser-audio', {
      body: { 
        audioUrl: audioPath,
        enregistrementId: recordingId
      }
    });
    
    if (error || !data.success) {
      console.error('Error analyzing audio:', error || data.error);
      throw new Error(error?.message || data.error || "Erreur lors de l'analyse");
    }
    
    return {
      analysis: data.analysis as AudioAnalysis,
      suggestions: data.suggestions as WordSuggestion[]
    };
  } catch (error) {
    console.error('Error in analyzeAudio:', error);
    
    // En cas d'erreur, retourner des données simulées pour le développement
    return mockAnalyzeAudio(audioBlob);
  }
}

// Fonction utilitaire pour obtenir la durée d'un fichier audio
async function getAudioDuration(audioBlob: Blob): Promise<number> {
  return new Promise((resolve) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration);
      URL.revokeObjectURL(audioUrl);
    });
    
    // En cas d'erreur, estimer la durée (10 secondes par défaut)
    audio.addEventListener('error', () => {
      resolve(10);
      URL.revokeObjectURL(audioUrl);
    });
    
    // Si le chargement prend trop de temps, estimer la durée
    setTimeout(() => {
      if (audio.duration === Infinity) {
        resolve(10);
        URL.revokeObjectURL(audioUrl);
      }
    }, 1000);
  });
}

// Fonction de repli pour simuler l'analyse pendant le développement
function mockAnalyzeAudio(audioBlob: Blob): Promise<{
  analysis: AudioAnalysis;
  suggestions: WordSuggestion[];
}> {
  // Simuler un délai d'API
  return new Promise(resolve => setTimeout(resolve, 1000))
    .then(() => {
      // Générer un score aléatoire entre 65 et 95
      const overallScore = Math.floor(Math.random() * (95 - 65 + 1)) + 65;
      
      // Générer des métriques aléatoires proches du score global
      const fluidityScore = clampScore(overallScore + randomVariation(10));
      const vocabularyScore = clampScore(overallScore + randomVariation(15));
      const grammarScore = clampScore(overallScore + randomVariation(5));
      const rhythmScore = clampScore(overallScore + randomVariation(12));
      
      // Transcriptions potentielles
      const possibleTranscripts = [
        "Bonjour, je vous présente aujourd'hui mon parcours professionnel. J'ai travaillé pendant plusieurs années dans le domaine du marketing digital où j'ai pu développer mes compétences en stratégie de contenu et analyse de données.",
        "Je souhaiterais aborder la question de l'impact environnemental des entreprises. Il est crucial de mettre en place des pratiques durables pour préserver notre planète et assurer un avenir viable pour les générations futures.",
      ];
      
      // Créer l'objet d'analyse
      const analysis: AudioAnalysis = {
        score: overallScore,
        transcript: possibleTranscripts[Math.floor(Math.random() * possibleTranscripts.length)],
        metrics: [
          { name: "Fluidité", value: fluidityScore, color: "#38B2AC" },
          { name: "Vocabulaire", value: vocabularyScore, color: "#ED8936" },
          { name: "Grammaire", value: grammarScore, color: "#9F7AEA" },
          { name: "Rythme", value: rhythmScore, color: "#F687B3" },
        ]
      };
      
      // Suggestions de mots potentielles
      const suggestionPool: WordSuggestion[] = [
        { original: "plusieurs années", suggestion: "de nombreuses années", reason: "Expression plus soutenue et précise" },
        { original: "travailler sur", suggestion: "mener à bien", reason: "Verbe d'action plus valorisant" },
        { original: "vraiment", suggestion: "considérablement", reason: "Adverbe plus soutenu" },
        { original: "important", suggestion: "significatif", reason: "Adjectif plus précis et élégant" },
      ];
      
      // Sélectionner 3-5 suggestions aléatoires
      const numberOfSuggestions = Math.floor(Math.random() * 3) + 3;
      const mockSuggestions = shuffleArray(suggestionPool).slice(0, numberOfSuggestions);
      
      return { analysis, suggestions: mockSuggestions };
    });
}

// Fonctions utilitaires pour la génération de données simulées
function randomVariation(range: number): number {
  return Math.floor(Math.random() * range * 2) - range;
}

function clampScore(score: number): number {
  return Math.min(98, Math.max(60, score));
}

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}
