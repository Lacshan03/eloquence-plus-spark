
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { WordSuggestion } from '@/components/VocabularySuggestions';

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
};

// Function to export vocabulary suggestions to CSV
export const exportSuggestionsToCSV = (
  suggestions: WordSuggestion[],
  filename: string = `ameliorations_${new Date().toISOString().slice(0, 10)}.csv`
): void => {
  const data = suggestions.map(suggestion => ({
    motOriginal: suggestion.original,
    motAmeliore: suggestion.suggestion,
    raison: suggestion.reason
  }));
  
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, filename);
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
