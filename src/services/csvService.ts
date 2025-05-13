import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { WordSuggestion } from '@/components/VocabularySuggestions';
import { supabase } from '@/integrations/supabase/client';

// Type definitions for CSV data
export interface TranscriptionEntry {
  date: string;
  transcript: string;
  score: number;
  duration: number;
}

export interface VocabularyEntry {
  motOriginal: string;
  motAmeliore: string;
  raison: string;
  categorie: string;
  niveau: string;
}

// Function to export transcription to CSV file
export const exportTranscriptionToCSV = (
  transcript: string, 
  score: number, 
  duration: number,
  filename: string = `transcription_${new Date().toISOString().slice(0, 10)}.csv`
): void => {
  const data: TranscriptionEntry[] = [{
    date: new Date().toISOString(),
    transcript,
    score,
    duration
  }];
  
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, filename);
  
  // Also save to Supabase storage if user is authenticated
  saveToStorage(blob, filename, 'transcriptions').catch(error => 
    console.error('Error saving transcription to storage:', error)
  );
};

// Function to export vocabulary suggestions to CSV
export const exportSuggestionsToCSV = (
  suggestions: WordSuggestion[],
  filename: string = `ameliorations_${new Date().toISOString().slice(0, 10)}.csv`
): void => {
  const data = suggestions.map(suggestion => ({
    motOriginal: suggestion.original,
    motAmeliore: suggestion.suggestion,
    raison: suggestion.reason,
    categorie: getCategoryFromContext(suggestion),
    niveau: 'courant'
  }));
  
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, filename);
  
  // Also save to Supabase storage if user is authenticated
  saveToStorage(blob, filename, 'vocabulaire').catch(error => 
    console.error('Error saving vocabulary to storage:', error)
  );
  
  // Sync with database through edge function
  syncVocabularyWithDatabase(blob, filename).catch(error => 
    console.error('Error syncing vocabulary with database:', error)
  );
};

// Function to categorize vocabulary based on context
const getCategoryFromContext = (suggestion: WordSuggestion): string => {
  // Simple heuristic to categorize words
  const original = suggestion.original.toLowerCase();
  const reason = suggestion.reason.toLowerCase();
  
  if (reason.includes('adjectif') || reason.includes('qualificatif')) {
    return 'adjectif';
  } else if (reason.includes('adverbe')) {
    return 'adverbe';
  } else if (reason.includes('verbe') || original.endsWith('er') || original.endsWith('ir') || original.endsWith('re')) {
    return 'verbe';
  } else if (reason.includes('connecteur') || reason.includes('conjonction')) {
    return 'connecteur';
  } else if (reason.includes('expression') || original.includes(' ')) {
    return 'expression';
  } else {
    return 'nom';
  }
};

// Load vocabulary from CSV file
export const loadVocabularyFromCSV = async (url: string): Promise<VocabularyEntry[]> => {
  try {
    const response = await fetch(url);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          resolve(results.data as VocabularyEntry[]);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Erreur lors du chargement du fichier CSV:', error);
    return [];
  }
};

// Function to save file to Supabase storage
const saveToStorage = async (blob: Blob, filename: string, bucketName: string): Promise<void> => {
  try {
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session || !session.session) {
      console.log('User not authenticated, skipping storage save');
      return;
    }
    
    const userId = session.session.user.id;
    const path = `${userId}/${filename}`;
    
    // Upload file to storage
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(path, blob, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      throw error;
    }
    
    console.log(`Successfully saved ${filename} to ${bucketName} bucket`);
  } catch (error) {
    console.error('Error saving to storage:', error);
    throw error;
  }
};

// Function to sync vocabulary CSV with the database
const syncVocabularyWithDatabase = async (blob: Blob, filename: string): Promise<void> => {
  try {
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session || !session.session) {
      console.log('User not authenticated, skipping database sync');
      return;
    }
    
    // Upload to storage first to get URL
    const userId = session.session.user.id;
    const path = `${userId}/${filename}`;
    
    // Upload to get the URL
    const { data, error } = await supabase.storage
      .from('vocabulaire')
      .upload(path, blob, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      throw error;
    }
    
    // Get the URL of the uploaded file
    const { data: urlData } = await supabase.storage
      .from('vocabulaire')
      .getPublicUrl(path);
      
    if (!urlData.publicUrl) {
      throw new Error('Could not get public URL for uploaded file');
    }
    
    // Call the vocabulary-sync edge function
    const result = await supabase.functions.invoke('vocabulary-sync', {
      body: {
        fileUrl: urlData.publicUrl,
        category: 'utilisateur'
      }
    });
    
    console.log('Vocabulary sync result:', result);
  } catch (error) {
    console.error('Error syncing vocabulary with database:', error);
    throw error;
  }
};

// Function to enhance vocabulary suggestions with additional options from the database
export const enhanceVocabularySuggestions = async (originalSuggestions: WordSuggestion[]): Promise<WordSuggestion[]> => {
  try {
    // If we have very few or no suggestions, return the original list
    if (!originalSuggestions || originalSuggestions.length < 2) {
      return originalSuggestions;
    }
    
    // Extract unique original words
    const originalWords = new Set(originalSuggestions.map(s => s.original.toLowerCase()));
    
    // Query the database for additional suggestions
    const { data, error } = await supabase
      .from('mots_ameliores')
      .select('mot_original, mot_ameliore, exemple_utilisation, categorie')
      .in('categorie', ['adjectif', 'adverbe', 'verbe', 'expression'])
      .limit(20);
      
    if (error || !data || data.length === 0) {
      console.log('No additional suggestions found in database');
      return originalSuggestions;
    }
    
    // Filter out suggestions we already have
    const additionalSuggestions = data
      .filter(item => !originalWords.has(item.mot_original.toLowerCase()))
      .map(item => ({
        original: item.mot_original,
        suggestion: item.mot_ameliore,
        reason: item.exemple_utilisation || `Suggestion de la catégorie ${item.categorie}`
      }));
    
    // Combine original and new suggestions, but limit to reasonable number
    const combined = [...originalSuggestions, ...additionalSuggestions];
    const maxSuggestions = 8;
    
    return combined.slice(0, maxSuggestions);
  } catch (error) {
    console.error('Error enhancing vocabulary suggestions:', error);
    return originalSuggestions;
  }
};

// Function to get vocabulary statistics
export const getVocabularyStatistics = async (): Promise<any> => {
  try {
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session || !session.session) {
      return {
        totalWords: 0,
        categoryCounts: {},
        recentAdditions: []
      };
    }
    
    // Get total vocabulary count
    const { count: totalCount, error: countError } = await supabase
      .from('mots_ameliores')
      .select('*', { count: 'exact', head: true });
      
    // Get category distribution
    const { data: categoryData, error: categoryError } = await supabase
      .from('mots_ameliores')
      .select('categorie')
      
    // Get recent additions
    const { data: recentData, error: recentError } = await supabase
      .from('mots_ameliores')
      .select('mot_original, mot_ameliore, categorie, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (countError || categoryError || recentError) {
      console.error('Error fetching vocabulary statistics:', { countError, categoryError, recentError });
    }
    
    // Calculate category distribution
    const categoryCounts: Record<string, number> = {};
    if (categoryData) {
      categoryData.forEach(item => {
        categoryCounts[item.categorie] = (categoryCounts[item.categorie] || 0) + 1;
      });
    }
    
    return {
      totalWords: totalCount || 0,
      categoryCounts,
      recentAdditions: recentData || []
    };
  } catch (error) {
    console.error('Error getting vocabulary statistics:', error);
    return {
      totalWords: 0,
      categoryCounts: {},
      recentAdditions: []
    };
  }
};

// Function to generate and add test vocabulary data
export const generateTestVocabularyData = async (): Promise<void> => {
  try {
    // Base vocabulary entries for testing
    const testData: Array<Omit<VocabularyEntry, 'categorie' | 'niveau'> & { categorie?: string, niveau?: string }> = [
      { motOriginal: "important", motAmeliore: "crucial", raison: "Plus précis et formel" },
      { motOriginal: "problème", motAmeliore: "enjeu", raison: "Terme plus constructif" },
      { motOriginal: "souvent", motAmeliore: "fréquemment", raison: "Adverbe plus soutenu" },
      { motOriginal: "beaucoup", motAmeliore: "considérablement", raison: "Plus élégant et précis" },
      { motOriginal: "mais", motAmeliore: "cependant", raison: "Connecteur plus formel" }
    ];
    
    // Add categories and levels
    const categorizedData = testData.map(item => ({
      ...item,
      categorie: item.categorie || getCategoryFromContext({ 
        original: item.motOriginal, 
        suggestion: item.motAmeliore, 
        reason: item.raison 
      }),
      niveau: item.niveau || 'courant'
    }));
    
    // Format as CSV
    const csv = Papa.unparse(categorizedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    
    // Save to local storage and sync with database
    const filename = `test_vocabulary_${Date.now()}.csv`;
    await saveToStorage(blob, filename, 'vocabulaire');
    await syncVocabularyWithDatabase(blob, filename);
    
    console.log('Test vocabulary data generated and saved');
  } catch (error) {
    console.error('Error generating test vocabulary data:', error);
  }
};
