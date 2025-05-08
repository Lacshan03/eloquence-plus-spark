
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProgressChart from './ProgressChart';

interface ResultProps {
  score: number;
  fluidity: number;
  vocabulary: number;
  grammar: number;
  feedback: string;
  suggestedWords: string[];
  onFinish: () => void;
}

const SessionResult: React.FC<ResultProps> = ({
  score,
  fluidity,
  vocabulary,
  grammar,
  feedback,
  suggestedWords,
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
          <h3 className="text-lg font-medium mb-4">Feedback</h3>
          <p className="text-gray-700">{feedback}</p>
        </Card>
        
        <Card className="p-6 eloquence-card">
          <h3 className="text-lg font-medium mb-4">Mots à retenir</h3>
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
