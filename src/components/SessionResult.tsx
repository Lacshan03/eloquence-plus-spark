
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProgressChart from './ProgressChart';
import { Download, Save } from 'lucide-react';
import { exportTranscriptionToCSV, exportSuggestionsToCSV } from '@/services/csvService';
import { toast } from '@/hooks/use-toast';

interface ResultProps {
  score: number;
  fluidity: number;
  vocabulary: number;
  grammar: number;
  feedback: string;
  suggestedWords: string[];
  transcript?: string;
  duration?: number;
  onFinish: () => void;
}

const SessionResult: React.FC<ResultProps> = ({
  score,
  fluidity,
  vocabulary,
  grammar,
  feedback,
  suggestedWords,
  transcript = "",
  duration = 0,
  onFinish
}) => {
  // Data pour le graphique en radar
  const chartData = [
    {
      date: "Session actuelle",
      score,
      fluidity,
      vocabulary,
      grammar
    }
  ];

  // Handler for exporting transcription to CSV
  const handleExportTranscription = () => {
    if (transcript) {
      exportTranscriptionToCSV(transcript, score, duration);
      toast({
        title: "Exporté avec succès",
        description: "La transcription a été enregistrée en CSV"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur d'exportation",
        description: "Aucune transcription disponible"
      });
    }
  };

  // Handler for exporting vocabulary to CSV
  const handleExportVocabulary = () => {
    if (suggestedWords.length > 0) {
      // Convert simple strings to WordSuggestion format
      const suggestions = suggestedWords.map(word => ({
        original: "",  // We don't have originals in this context
        suggestion: word,
        reason: "Mot suggéré pour amélioration"
      }));
      
      exportSuggestionsToCSV(suggestions);
      toast({
        title: "Exporté avec succès",
        description: "Le vocabulaire a été enregistré en CSV"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur d'exportation",
        description: "Aucun mot suggéré disponible"
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-poppins font-medium mb-6">Résultats de votre session</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 eloquence-card flex flex-col items-center justify-center">
          <span className="text-sm text-gray-500 mb-1">Score global</span>
          <div className="text-4xl font-bold text-eloquence-primary">{score}<span className="text-xl">/100</span></div>
        </Card>
        
        <Card className="p-6 eloquence-card flex flex-col items-center justify-center">
          <span className="text-sm text-gray-500 mb-1">Fluidité</span>
          <div className="text-4xl font-bold text-eloquence-secondary">{fluidity}<span className="text-xl">/100</span></div>
        </Card>
        
        <Card className="p-6 eloquence-card flex flex-col items-center justify-center">
          <span className="text-sm text-gray-500 mb-1">Vocabulaire</span>
          <div className="text-4xl font-bold text-eloquence-accent">{vocabulary}<span className="text-xl">/100</span></div>
        </Card>
      </div>
      
      {/* Graphique de performance */}
      <Card className="p-6 mb-8 eloquence-card">
        <h3 className="text-lg font-medium mb-4">Analyse détaillée</h3>
        <div className="h-64">
          <ProgressChart data={chartData} height={250} />
        </div>
      </Card>
      
      {/* Feedback et suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 eloquence-card">
          <h3 className="text-lg font-medium mb-4 flex justify-between items-center">
            <span>Feedback</span>
            {transcript && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportTranscription}
                className="flex items-center gap-1"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Exporter CSV</span>
              </Button>
            )}
          </h3>
          <p className="text-gray-700">{feedback}</p>
          
          {transcript && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium mb-2 text-gray-600">Transcription</h4>
              <p className="text-sm italic text-gray-600 bg-gray-50 p-3 rounded-md">{transcript}</p>
            </div>
          )}
        </Card>
        
        <Card className="p-6 eloquence-card">
          <h3 className="text-lg font-medium mb-4 flex justify-between items-center">
            <span>Mots à retenir</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportVocabulary}
              className="flex items-center gap-1"
            >
              <Save size={16} />
              <span className="hidden sm:inline">Enregistrer</span>
            </Button>
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestedWords.map((word, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-eloquence-light rounded-full text-sm text-eloquence-primary"
              >
                {word}
              </span>
            ))}
          </div>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={onFinish} className="bg-eloquence-primary hover:bg-eloquence-primary/90">
          Terminer et revenir au tableau de bord
        </Button>
      </div>
    </div>
  );
};

export default SessionResult;
