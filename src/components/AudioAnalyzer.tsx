
import React from 'react';
import { Card } from '@/components/ui/card';
import ProgressChart from './ProgressChart';

export interface AnalysisMetric {
  name: string;
  value: number;
  target?: number;
  color?: string;
}

export interface AudioAnalysis {
  score: number;
  transcript: string;
  metrics: AnalysisMetric[];
}

interface AudioAnalyzerProps {
  analysis: AudioAnalysis | null;
  isLoading: boolean;
}

const AudioAnalyzer: React.FC<AudioAnalyzerProps> = ({ analysis, isLoading }) => {
  // Generate chart data from analysis metrics
  const chartData = analysis ? [
    {
      date: "Session actuelle",
      score: analysis.score,
      fluidity: analysis.metrics.find(m => m.name === "Fluidité")?.value || 0,
      vocabulary: analysis.metrics.find(m => m.name === "Vocabulaire")?.value || 0,
      grammar: analysis.metrics.find(m => m.name === "Grammaire")?.value || 0
    }
  ] : [];

  if (isLoading) {
    return (
      <Card className="p-6 eloquence-card">
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-8 h-8 border-4 border-eloquence-primary/30 border-t-eloquence-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Analyse en cours...</p>
        </div>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="p-6 eloquence-card">
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <p className="text-gray-500">Enregistrez votre audio pour obtenir une analyse</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 eloquence-card">
      <h3 className="text-lg font-medium mb-4">Analyse de votre éloquence</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-eloquence-light p-4 rounded-lg text-center">
          <span className="text-sm text-gray-500">Score global</span>
          <div className="text-3xl font-bold text-eloquence-primary">{analysis.score}<span className="text-xl">/100</span></div>
        </div>
        
        {analysis.metrics.slice(0, 2).map((metric) => (
          <div key={metric.name} className="bg-eloquence-light p-4 rounded-lg text-center">
            <span className="text-sm text-gray-500">{metric.name}</span>
            <div className="text-3xl font-bold text-eloquence-secondary">{metric.value}<span className="text-xl">/100</span></div>
          </div>
        ))}
      </div>
      
      <div className="mb-6">
        <h4 className="text-md font-medium mb-2">Transcription</h4>
        <div className="bg-gray-50 p-3 rounded-md max-h-32 overflow-y-auto text-sm">
          {analysis.transcript}
        </div>
      </div>
      
      <div className="h-64 mb-4">
        <ProgressChart data={chartData} />
      </div>
    </Card>
  );
};

export default AudioAnalyzer;
