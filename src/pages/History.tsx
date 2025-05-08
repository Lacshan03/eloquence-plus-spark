
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProgressChart from '@/components/ProgressChart';

interface Session {
  id: number;
  date: string;
  title: string;
  category: string;
  type: 'oral' | 'ecrit';
  score: number;
  fluidity: number;
  vocabulary: number;
  grammar: number;
}

interface Word {
  id: number;
  word: string;
  synonyms: string[];
  addedOn: string;
  category: string;
}

const History = () => {
  const [filter, setFilter] = useState('all');
  const [period, setPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('sessions');
  
  // Données simulées pour les sessions
  const sessions: Session[] = [
    {
      id: 1,
      date: '12 mai 2024',
      title: 'Discours persuasif',
      category: 'persuasion',
      type: 'oral',
      score: 83,
      fluidity: 80,
      vocabulary: 85,
      grammar: 84
    },
    {
      id: 2,
      date: '10 mai 2024',
      title: 'Présentation professionnelle',
      category: 'professional',
      type: 'oral',
      score: 78,
      fluidity: 75,
      vocabulary: 80,
      grammar: 78
    },
    {
      id: 3,
      date: '7 mai 2024',
      title: 'Argumentation',
      category: 'argumentation',
      type: 'ecrit',
      score: 72,
      fluidity: 70,
      vocabulary: 73,
      grammar: 72
    },
    {
      id: 4,
      date: '5 mai 2024',
      title: 'Description détaillée',
      category: 'description',
      type: 'ecrit',
      score: 65,
      fluidity: 60,
      vocabulary: 70,
      grammar: 65
    }
  ];
  
  // Données simulées pour les mots à réutiliser
  const words: Word[] = [
    {
      id: 1,
      word: 'Perspicace',
      synonyms: ['Clairvoyant', 'Lucide', 'Sagace'],
      addedOn: '12 mai 2024',
      category: 'qualités'
    },
    {
      id: 2,
      word: 'Élucider',
      synonyms: ['Éclaircir', 'Expliquer', 'Résoudre'],
      addedOn: '10 mai 2024',
      category: 'actions'
    },
    {
      id: 3,
      word: 'Paradigme',
      synonyms: ['Modèle', 'Référence', 'Archétype'],
      addedOn: '10 mai 2024',
      category: 'concepts'
    },
    {
      id: 4,
      word: 'Prépondérant',
      synonyms: ['Dominant', 'Capital', 'Décisif'],
      addedOn: '7 mai 2024',
      category: 'importance'
    },
    {
      id: 5,
      word: 'Étoffer',
      synonyms: ['Enrichir', 'Développer', 'Approfondir'],
      addedOn: '5 mai 2024',
      category: 'actions'
    }
  ];
  
  // Données pour les graphiques
  const chartData = [
    { date: "Semaine 1", score: 65, fluidity: 60, vocabulary: 70, grammar: 65 },
    { date: "Semaine 2", score: 68, fluidity: 65, vocabulary: 70, grammar: 68 },
    { date: "Semaine 3", score: 72, fluidity: 70, vocabulary: 73, grammar: 72 },
    { date: "Semaine 4", score: 78, fluidity: 75, vocabulary: 78, grammar: 80 },
    { date: "Semaine 5", score: 83, fluidity: 80, vocabulary: 85, grammar: 84 }
  ];
  
  // Filtrer les sessions
  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    if (filter === 'oral') return session.type === 'oral';
    if (filter === 'ecrit') return session.type === 'ecrit';
    return true;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={true} />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-poppins font-bold mb-2">Historique et Progrès</h1>
              <p className="text-gray-600">Suivez votre progression et consultez votre historique d'exercices</p>
            </div>
            <Button asChild className="mt-4 md:mt-0 bg-eloquence-primary hover:bg-eloquence-primary/90">
              <Link to="/training">
                Nouvelle session
              </Link>
            </Button>
          </div>
          
          {/* Chart Card */}
          <Card className="p-6 eloquence-card mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-xl font-medium">Évolution de vos performances</h2>
              <div className="mt-4 md:mt-0">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sélectionner une période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="week">Cette semaine</SelectItem>
                      <SelectItem value="month">Ce mois</SelectItem>
                      <SelectItem value="3months">3 derniers mois</SelectItem>
                      <SelectItem value="year">Cette année</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="h-64 md:h-80">
              <ProgressChart data={chartData} />
            </div>
          </Card>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="sessions">
                Sessions d'entraînement
              </TabsTrigger>
              <TabsTrigger value="words">
                Mots à réutiliser
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sessions" className="animate-fade-in">
              <Card className="eloquence-card mb-8">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <h2 className="text-xl font-medium mb-4 md:mb-0">Sessions d'entraînement</h2>
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrer par type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">Tous les types</SelectItem>
                          <SelectItem value="oral">Exercices oraux</SelectItem>
                          <SelectItem value="ecrit">Exercices écrits</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Titre</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Score</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredSessions.map(session => (
                          <tr key={session.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm">{session.date}</td>
                            <td className="px-4 py-4 text-sm font-medium">{session.title}</td>
                            <td className="px-4 py-4 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                session.type === 'oral'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {session.type === 'oral' ? 'Oral' : 'Écrit'}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                session.score >= 80 
                                  ? 'bg-green-100 text-green-800' 
                                  : session.score >= 70 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {session.score}/100
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/sessions/${session.id}`}>Détails</Link>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {filteredSessions.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        Aucune session ne correspond à votre filtre.
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="words" className="animate-fade-in">
              <Card className="eloquence-card mb-8">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-medium mb-6">Mots à réutiliser</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {words.map(word => (
                      <Card key={word.id} className="p-4 border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-lg">{word.word}</h3>
                          <span className="bg-eloquence-light text-eloquence-primary text-xs px-2 py-1 rounded-full">
                            {word.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          <strong>Synonymes:</strong> {word.synonyms.join(', ')}
                        </p>
                        <div className="text-xs text-gray-500">Ajouté le {word.addedOn}</div>
                      </Card>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default History;
