
import React from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

export interface WordSuggestion {
  original: string;
  suggestion: string;
  reason: string;
}

interface VocabularySuggestionsProps {
  suggestions: WordSuggestion[];
  isLoading: boolean;
}

const VocabularySuggestions: React.FC<VocabularySuggestionsProps> = ({ suggestions, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6 eloquence-card">
        <h3 className="text-lg font-medium mb-4">Suggestions lexicales</h3>
        <div className="flex flex-col items-center justify-center min-h-[100px]">
          <div className="w-6 h-6 border-2 border-eloquence-accent/30 border-t-eloquence-accent rounded-full animate-spin"></div>
          <p className="mt-3 text-sm text-gray-500">Analyse du vocabulaire...</p>
        </div>
      </Card>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <Card className="p-6 eloquence-card">
        <h3 className="text-lg font-medium mb-4">Suggestions lexicales</h3>
        <div className="flex flex-col items-center justify-center min-h-[100px]">
          <p className="text-sm text-gray-500">Aucune suggestion disponible</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 eloquence-card">
      <h3 className="text-lg font-medium mb-4">Suggestions lexicales</h3>
      <div className="space-y-3">
        {suggestions.map((item, index) => (
          <div key={index} className="bg-eloquence-light/40 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="line-through text-gray-500">{item.original}</span>
              <span className="text-xl">→</span>
              <span className="font-medium text-eloquence-accent">{item.suggestion}</span>
            </div>
            <p className="text-xs text-gray-600 italic">{item.reason}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-500 flex items-center">
        <Check size={12} className="mr-1 text-green-500" />
        Ces mots seront ajoutés à votre liste de vocabulaire à réutiliser
      </div>
    </Card>
  );
};

export default VocabularySuggestions;
