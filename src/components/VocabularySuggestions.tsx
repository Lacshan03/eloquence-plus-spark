
import React from 'react';
import { Card } from '@/components/ui/card';
import { Check, Tag, DownloadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { enhanceVocabularySuggestions } from '@/services/csvService';
import { useQuery } from '@tanstack/react-query';

export interface WordSuggestion {
  original: string;
  suggestion: string;
  reason: string;
  category?: string;
}

interface VocabularySuggestionsProps {
  suggestions: WordSuggestion[];
  isLoading: boolean;
  onExport?: () => void;
}

// Function to determine category-based styling
const getCategoryStyles = (category?: string) => {
  const defaultStyles = { bg: "bg-gray-100", text: "text-gray-600" };
  
  if (!category) return defaultStyles;
  
  const categoryMap: Record<string, { bg: string, text: string }> = {
    "adjectif": { bg: "bg-blue-100", text: "text-blue-600" },
    "adverbe": { bg: "bg-green-100", text: "text-green-600" },
    "verbe": { bg: "bg-purple-100", text: "text-purple-600" },
    "nom": { bg: "bg-orange-100", text: "text-orange-600" },
    "expression": { bg: "bg-teal-100", text: "text-teal-600" },
    "connecteur": { bg: "bg-rose-100", text: "text-rose-600" }
  };
  
  return categoryMap[category.toLowerCase()] || defaultStyles;
};

const VocabularySuggestions: React.FC<VocabularySuggestionsProps> = ({ 
  suggestions: initialSuggestions, 
  isLoading,
  onExport 
}) => {
  // Enhance suggestions with database-sourced options
  const { data: enhancedSuggestions, isLoading: isEnhancing } = useQuery({
    queryKey: ['enhancedSuggestions', initialSuggestions?.length],
    queryFn: () => enhanceVocabularySuggestions(initialSuggestions),
    enabled: !isLoading && initialSuggestions?.length > 0,
    initialData: initialSuggestions
  });
  
  const suggestions = enhancedSuggestions || initialSuggestions;
  const showLoading = isLoading || isEnhancing;
  
  if (showLoading) {
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
        <h3 className="text-lg font-medium mb-4 flex justify-between items-center">
          <span>Suggestions lexicales</span>
        </h3>
        <div className="flex flex-col items-center justify-center min-h-[100px]">
          <p className="text-sm text-gray-500">Aucune suggestion disponible</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 eloquence-card">
      <h3 className="text-lg font-medium mb-4 flex justify-between items-center">
        <span>Suggestions lexicales</span>
        {onExport && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onExport}
            className="flex items-center gap-1 text-eloquence-accent hover:text-eloquence-accent/80"
          >
            <DownloadCloud size={16} />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
        )}
      </h3>
      <div className="space-y-3">
        {suggestions.map((item, index) => {
          const categoryStyles = getCategoryStyles(item.category);
          
          return (
            <div key={index} className="bg-eloquence-light/40 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="line-through text-gray-500">{item.original}</span>
                <span className="text-xl">→</span>
                <span className="font-medium text-eloquence-accent">{item.suggestion}</span>
              </div>
              <p className="text-xs text-gray-600 italic">{item.reason}</p>
              {item.category && (
                <div className="mt-2 flex justify-end">
                  <span className={`text-xs inline-flex items-center px-2 py-1 rounded-full ${categoryStyles.bg} ${categoryStyles.text}`}>
                    <Tag size={10} className="mr-1" />
                    {item.category}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-xs text-gray-500 flex items-center">
        <Check size={12} className="mr-1 text-green-500" />
        Ces mots seront ajoutés à votre liste de vocabulaire à réutiliser
      </div>
    </Card>
  );
};

export default VocabularySuggestions;
