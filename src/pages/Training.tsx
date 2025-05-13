import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Mic, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AudioRecorder from '@/components/AudioRecorder';
import SessionResult from '@/components/SessionResult';
import AudioAnalyzer, { AudioAnalysis } from '@/components/AudioAnalyzer';
import VocabularySuggestions, { WordSuggestion } from '@/components/VocabularySuggestions';
import { analyzeAudio, initVocabularyDatabase } from '@/services/audioAnalysisService';
import { useToast } from '@/hooks/use-toast';

// Scenarios for training exercises
interface Scenario {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
}

const Training = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const categoryParam = searchParams.get('category');
  
  const [activeTab, setActiveTab] = useState<string>('oral');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [sessionStep, setSessionStep] = useState<'select' | 'exercise' | 'results'>('select');
  const [audioAnalysis, setAudioAnalysis] = useState<AudioAnalysis | null>(null);
  const [wordSuggestions, setWordSuggestions] = useState<WordSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Initialize vocabulary database on component mount
  useEffect(() => {
    initVocabularyDatabase().catch(error => 
      console.error('Error initializing vocabulary:', error)
    );
  }, []);

  // Mock scenarios data
  const scenarios: Scenario[] = [
    {
      id: '1',
      title: 'Présentation professionnelle',
      description: 'Présentez-vous de façon professionnelle et parlez de vos compétences.',
      prompt: "Imaginez que vous êtes en entretien d'embauche. Présentez-vous en mettant en valeur vos compétences et expériences de façon éloquente et professionnelle.",
      category: 'professional',
      difficulty: 'moyen'
    },
    {
      id: '2',
      title: 'Argumentation convaincante',
      description: 'Défendez un point de vue avec des arguments structurés.',
      prompt: "Choisissez un sujet qui vous tient à cœur et développez une argumentation convaincante en trois points principaux, avec une introduction et une conclusion.",
      category: 'argumentation',
      difficulty: 'difficile'
    },
    {
      id: '3',
      title: 'Description détaillée',
      description: 'Décrivez un lieu ou un objet avec un vocabulaire riche.',
      prompt: "Décrivez un lieu qui vous a marqué en utilisant un vocabulaire précis et évocateur. Variez les registres sensoriels (vue, ouïe, odorat, toucher).",
      category: 'description',
      difficulty: 'facile'
    },
    {
      id: '4',
      title: 'Narration fluide',
      description: 'Racontez une histoire courte avec fluidité.',
      prompt: "Racontez un événement marquant de votre vie de manière vivante et fluide, en soignant les transitions entre les différentes parties de votre récit.",
      category: 'narration',
      difficulty: 'moyen'
    },
    {
      id: '5',
      title: 'Vocabulaire technique',
      description: 'Expliquez un concept technique avec clarté.',
      prompt: "Choisissez un concept ou processus lié à votre domaine de compétence et expliquez-le de manière claire et précise en utilisant le vocabulaire technique approprié.",
      category: 'vocabulary',
      difficulty: 'difficile'
    }
  ];

  // Filter scenarios by category if provided in URL params
  const filteredScenarios = categoryParam 
    ? scenarios.filter(scenario => scenario.category.toLowerCase() === categoryParam.toLowerCase())
    : scenarios;

  const handleScenarioSelect = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setSessionStep('exercise');
    setAudioAnalysis(null);
    setWordSuggestions([]);
  };

  const handleNewScenario = () => {
    setSelectedScenario(null);
    setSessionStep('select');
    setAudioAnalysis(null);
    setWordSuggestions([]);
  };

  const handleRecordingComplete = async (audioBlob: Blob, duration?: number) => {
    // Save duration if provided
    if (duration) {
      setRecordingDuration(duration);
    }
    
    // In a real application, this would send the audio to your backend for processing
    try {
      setIsAnalyzing(true);
      toast({
        title: "Analyse en cours",
        description: "Nous analysons votre enregistrement...",
      });
      
      const result = await analyzeAudio(audioBlob);
      setAudioAnalysis(result.analysis);
      setWordSuggestions(result.suggestions);
      
      toast({
        title: "Analyse terminée",
        description: `Votre score: ${result.analysis.score}/100`,
      });
    } catch (error) {
      console.error("Error analyzing audio:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'analyse",
        description: "Une erreur s'est produite lors de l'analyse de votre enregistrement.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinishSession = () => {
    // In a real application, this would save the session results to your backend
    setSessionStep('results');
  };

  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  const renderSessionStep = () => {
    switch (sessionStep) {
      case 'select':
        return (
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-poppins font-medium mb-6">Choisissez un scénario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {filteredScenarios.map((scenario) => (
                <Card 
                  key={scenario.id} 
                  className="eloquence-card overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => handleScenarioSelect(scenario)}
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-medium">{scenario.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        scenario.difficulty === 'facile' 
                          ? 'bg-green-100 text-green-800' 
                          : scenario.difficulty === 'moyen'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {scenario.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{scenario.description}</p>
                    <div className="mt-auto flex justify-end">
                      <Button 
                        variant="ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScenarioSelect(scenario);
                        }}
                        className="flex items-center gap-2"
                      >
                        Sélectionner <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      case 'exercise':
        return (
          <div className="container max-w-4xl">
            {selectedScenario && (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-poppins font-medium mb-1">{selectedScenario.title}</h2>
                    <p className="text-gray-600">{selectedScenario.description}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleNewScenario}
                    className="mt-4 md:mt-0"
                  >
                    Changer de scénario
                  </Button>
                </div>
                
                <Card className="eloquence-card mb-6 p-6">
                  <h3 className="text-lg font-medium mb-2">Consigne</h3>
                  <p className="text-gray-700">{selectedScenario.prompt}</p>
                </Card>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <AudioRecorder onRecordingComplete={handleRecordingComplete} />
                  <AudioAnalyzer 
                    analysis={audioAnalysis}
                    isLoading={isAnalyzing}
                  />
                </div>
                
                <VocabularySuggestions 
                  suggestions={wordSuggestions}
                  isLoading={isAnalyzing}
                />
                
                <div className="flex justify-end mt-8">
                  <Button 
                    onClick={handleFinishSession}
                    disabled={!audioAnalysis || isAnalyzing}
                    className="bg-eloquence-primary hover:bg-eloquence-primary/90"
                  >
                    Terminer la session
                  </Button>
                </div>
              </>
            )}
          </div>
        );
      case 'results':
        return (
          <div className="container max-w-4xl">
            {audioAnalysis && (
              <SessionResult 
                score={audioAnalysis.score}
                fluidity={audioAnalysis.metrics.find(m => m.name === "Fluidité")?.value || 0}
                vocabulary={audioAnalysis.metrics.find(m => m.name === "Vocabulaire")?.value || 0}
                grammar={audioAnalysis.metrics.find(m => m.name === "Grammaire")?.value || 0}
                feedback="Votre présentation démontre une bonne maîtrise générale de l'expression orale. Votre grammaire est excellente, et votre fluidité est satisfaisante. Concentrez-vous sur l'enrichissement de votre vocabulaire en utilisant des termes plus précis et variés pour renforcer l'impact de votre discours."
                suggestedWords={wordSuggestions.map(s => s.suggestion)}
                transcript={audioAnalysis.transcript}
                duration={recordingDuration}
                onFinish={handleReturnToDashboard}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={true} />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-poppins font-bold mb-2">Entraînement</h1>
              <p className="text-gray-600">Améliorez votre éloquence avec nos exercices personnalisés</p>
            </div>
          </div>
          
          {sessionStep === 'select' && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="oral" className="flex items-center gap-2">
                  <Mic size={16} />
                  Exercices oraux
                </TabsTrigger>
                <TabsTrigger value="ecrit" className="flex items-center gap-2">
                  <BookOpen size={16} />
                  Exercices écrits
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="oral">
                {renderSessionStep()}
              </TabsContent>
              
              <TabsContent value="ecrit">
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <BookOpen size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Les exercices écrits seront disponibles prochainement</h3>
                  <p className="text-gray-500 mb-6">Notre équipe travaille actuellement sur de nouveaux exercices pour améliorer votre expression écrite.</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          {sessionStep !== 'select' && renderSessionStep()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Training;
