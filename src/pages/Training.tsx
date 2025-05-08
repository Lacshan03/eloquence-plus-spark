
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Mic, Send, RefreshCw, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AudioRecorder from '@/components/AudioRecorder';
import SessionResult from '@/components/SessionResult';

interface Scenario {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
}

const Training = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedTab, setSelectedTab] = useState<string>('oral');
  const [textInput, setTextInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  // Scénarios d'exemple
  const scenarios: Scenario[] = [
    {
      id: '1',
      title: 'Présentation professionnelle',
      description: 'Présentez-vous de façon professionnelle et parlez de vos compétences.',
      prompt: 'Imaginez que vous êtes en entretien d'embauche. Présentez-vous en mettant en valeur vos compétences et expériences de façon éloquente et professionnelle.',
      category: 'professional',
      difficulty: 'moyen'
    },
    {
      id: '2',
      title: 'Argumentation persuasive',
      description: 'Défendez votre point de vue sur un sujet controversé.',
      prompt: "Défendez votre position sur l'importance de l'intelligence artificielle dans la société moderne, en utilisant des arguments structurés et un vocabulaire précis.",
      category: categoryParam || 'persuasion',
      difficulty: 'difficile'
    },
    {
      id: '3',
      title: 'Description détaillée',
      description: 'Décrivez un lieu ou un événement avec précision et élégance.',
      prompt: "Décrivez un lieu qui vous a marqué, en utilisant un vocabulaire riche et varié pour faire vivre ce lieu à travers vos mots.",
      category: 'vocabulary',
      difficulty: 'facile'
    }
  ];
  
  const [currentScenario, setCurrentScenario] = useState<Scenario>(
    categoryParam 
      ? scenarios.find(s => s.category === categoryParam) || scenarios[0] 
      : scenarios[0]
  );
  
  const handleSwitchScenario = () => {
    const currentIndex = scenarios.findIndex(s => s.id === currentScenario.id);
    const nextIndex = (currentIndex + 1) % scenarios.length;
    setCurrentScenario(scenarios[nextIndex]);
    setTextInput('');
    toast({
      description: "Scénario changé avec succès.",
    });
  };
  
  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
    toast({
      description: "Enregistrement audio terminé.",
    });
  };
  
  const handleSubmit = async () => {
    if (selectedTab === 'ecrit' && !textInput.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez écrire votre réponse avant de soumettre.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedTab === 'oral' && !audioBlob) {
      toast({
        title: "Erreur",
        description: "Veuillez enregistrer votre réponse audio avant de soumettre.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulation d'une analyse et d'une réponse de l'API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dans un cas réel, nous ferions un appel à l'API ici
      // const formData = new FormData();
      // if (selectedTab === 'oral') {
      //   formData.append('audio', audioBlob);
      // } else {
      //   formData.append('text', textInput);
      // }
      
      // const response = await fetch('/api/analyze', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // if (!response.ok) throw new Error("Erreur lors de l'analyse");
      
      toast({
        title: "Analyse terminée",
        description: "Votre performance a été évaluée avec succès.",
      });
      
      setShowResult(true);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'analyse.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFinishSession = () => {
    setShowResult(false);
    setTextInput('');
    setAudioBlob(null);
    navigate('/dashboard');
  };
  
  // Résultats simulés
  const simulatedResults = {
    score: 78,
    fluidity: 75,
    vocabulary: 80,
    grammar: 78,
    feedback: "Votre réponse démontre une bonne maîtrise du sujet. Votre vocabulaire est riche et varié, mais vous pourriez améliorer la fluidité de votre discours en évitant les hésitations. J'ai également remarqué quelques erreurs de syntaxe qui pourraient être corrigées. Pour enrichir davantage votre expression, essayez d'utiliser des connecteurs logiques plus variés et des synonymes plus précis pour les termes récurrents.",
    suggestedWords: ["Convaincant", "Perspicace", "Manifeste", "Prépondérant", "Élucider", "Étoffer", "Paradigme"]
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={true} />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container">
          {!showResult ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h1 className="text-3xl font-poppins font-bold mb-2">Session d'entraînement</h1>
                  <p className="text-gray-600">Perfectionnez votre éloquence avec nos exercices personnalisés</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleSwitchScenario}
                  className="mt-4 md:mt-0 flex items-center gap-1"
                >
                  <RefreshCw size={14} className="mr-1" />
                  Changer de scénario
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <Card className="p-6 eloquence-card mb-6">
                    <h2 className="text-xl font-medium mb-2">{currentScenario.title}</h2>
                    <p className="text-gray-600 mb-4">{currentScenario.description}</p>
                    <div className="bg-eloquence-light p-4 rounded-md mb-4">
                      <p className="text-gray-800">{currentScenario.prompt}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-eloquence-primary/10 text-eloquence-primary rounded-full text-sm">
                        {currentScenario.category.charAt(0).toUpperCase() + currentScenario.category.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        currentScenario.difficulty === 'facile' 
                          ? 'bg-green-100 text-green-800' 
                          : currentScenario.difficulty === 'moyen' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {currentScenario.difficulty.charAt(0).toUpperCase() + currentScenario.difficulty.slice(1)}
                      </span>
                    </div>
                  </Card>
                  
                  <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                    <TabsList className="grid grid-cols-2 mb-6">
                      <TabsTrigger value="oral" className="flex items-center gap-1">
                        <Mic size={14} />
                        Exercice oral
                      </TabsTrigger>
                      <TabsTrigger value="ecrit" className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Exercice écrit
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="oral" className="animate-fade-in">
                      <AudioRecorder onRecordingComplete={handleRecordingComplete} />
                    </TabsContent>
                    
                    <TabsContent value="ecrit" className="animate-fade-in">
                      <Card className="p-6 eloquence-card">
                        <h3 className="text-lg font-medium mb-4">Votre réponse écrite</h3>
                        <Textarea 
                          placeholder="Rédigez votre réponse ici..." 
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          className="min-h-[200px] mb-4"
                        />
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div>
                  <Card className="eloquence-card overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-xl font-medium mb-2">Instructions</h2>
                      <ul className="space-y-3 text-gray-600 mb-6">
                        <li className="flex items-start">
                          <CheckCircle size={16} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <span>Lisez attentivement le scénario proposé</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle size={16} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <span>Choisissez entre un exercice oral ou écrit</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle size={16} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <span>Pour l'exercice oral, enregistrez votre réponse</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle size={16} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <span>Pour l'exercice écrit, rédigez votre réponse</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle size={16} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <span>Soumettez votre réponse pour analyse</span>
                        </li>
                      </ul>
                      <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800">
                        <p className="font-medium mb-1">Conseil</p>
                        <p>Utilisez un vocabulaire riche et varié. Évitez les répétitions et les hésitations.</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <Button 
                        className="w-full bg-eloquence-primary hover:bg-eloquence-primary/90 flex items-center justify-center gap-1"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>Analyse en cours...</>
                        ) : (
                          <>
                            <Send size={14} className="mr-1" />
                            Soumettre pour analyse
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <SessionResult
              score={simulatedResults.score}
              fluidity={simulatedResults.fluidity}
              vocabulary={simulatedResults.vocabulary}
              grammar={simulatedResults.grammar}
              feedback={simulatedResults.feedback}
              suggestedWords={simulatedResults.suggestedWords}
              onFinish={handleFinishSession}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Training;
