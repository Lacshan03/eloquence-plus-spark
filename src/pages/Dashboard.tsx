
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Plus, Mic, BookOpen, Award } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProgressChart from '@/components/ProgressChart';

const Dashboard = () => {
  // Données simulées pour les graphiques
  const progressData = [
    { date: "Lun 05", score: 65, fluidity: 60, vocabulary: 70, grammar: 65 },
    { date: "Mar 06", score: 68, fluidity: 65, vocabulary: 70, grammar: 68 },
    { date: "Mer 07", score: 72, fluidity: 70, vocabulary: 73, grammar: 72 },
    { date: "Jeu 08", score: 75, fluidity: 72, vocabulary: 75, grammar: 75 },
    { date: "Ven 09", score: 78, fluidity: 75, vocabulary: 78, grammar: 80 },
    { date: "Sam 10", score: 80, fluidity: 78, vocabulary: 80, grammar: 82 },
    { date: "Dim 11", score: 83, fluidity: 80, vocabulary: 85, grammar: 84 }
  ];

  // Données simulées pour les exercices récents
  const recentExercises = [
    { id: 1, title: "Discours persuasif", date: "11 mai 2024", score: 83 },
    { id: 2, title: "Présentation professionnelle", date: "9 mai 2024", score: 78 },
    { id: 3, title: "Argumentation", date: "7 mai 2024", score: 72 }
  ];

  // Données simulées pour le défi du jour
  const dailyChallenge = {
    title: "Enrichir votre vocabulaire technique",
    description: "Réalisez une présentation de 2 minutes sur un sujet technologique en utilisant au moins 5 termes spécialisés.",
    reward: "Débloquer 3 nouveaux exercices avancés"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={true} />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-poppins font-bold mb-2">Bonjour, Utilisateur</h1>
              <p className="text-gray-600">Continuez à améliorer votre éloquence aujourd'hui</p>
            </div>
            <Button asChild className="mt-4 md:mt-0 bg-eloquence-primary hover:bg-eloquence-primary/90 flex items-center gap-2">
              <Link to="/training">
                <Plus size={16} />
                Nouvelle session
              </Link>
            </Button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-5 eloquence-card flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Score global</span>
              <span className="text-3xl font-bold text-eloquence-primary">83<span className="text-xl">/100</span></span>
              <span className="text-sm text-green-600 mt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +5 pts cette semaine
              </span>
            </Card>
            
            <Card className="p-5 eloquence-card flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Fluidité</span>
              <span className="text-3xl font-bold text-eloquence-secondary">80<span className="text-xl">/100</span></span>
              <span className="text-sm text-green-600 mt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +3 pts cette semaine
              </span>
            </Card>
            
            <Card className="p-5 eloquence-card flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Vocabulaire</span>
              <span className="text-3xl font-bold text-eloquence-accent">85<span className="text-xl">/100</span></span>
              <span className="text-sm text-green-600 mt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +7 pts cette semaine
              </span>
            </Card>
            
            <Card className="p-5 eloquence-card flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Grammaire</span>
              <span className="text-3xl font-bold text-eloquence-purple">84<span className="text-xl">/100</span></span>
              <span className="text-sm text-green-600 mt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +2 pts cette semaine
              </span>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Progress Chart */}
            <Card className="p-6 eloquence-card col-span-1 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Votre progression</h2>
                <Link to="/history" className="text-sm text-eloquence-primary hover:underline flex items-center">
                  Voir l'historique complet <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
              <div className="h-64 md:h-80">
                <ProgressChart data={progressData} />
              </div>
            </Card>
            
            {/* Daily Challenge */}
            <Card className="eloquence-card">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-medium">Défi du jour</h2>
                  <Award size={20} className="text-eloquence-accent" />
                </div>
                <h3 className="font-medium text-lg mb-2">{dailyChallenge.title}</h3>
                <p className="text-gray-600 mb-4">{dailyChallenge.description}</p>
                <div className="bg-green-50 p-3 rounded-md flex items-start mb-4">
                  <Award size={16} className="text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-green-800">{dailyChallenge.reward}</span>
                </div>
              </div>
              <div className="p-6">
                <Button className="w-full bg-eloquence-primary hover:bg-eloquence-primary/90" asChild>
                  <Link to="/training">Relever le défi</Link>
                </Button>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Exercises */}
            <Card className="eloquence-card">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">Exercices récents</h2>
                  <Mic size={20} className="text-eloquence-secondary" />
                </div>
                <div className="divide-y divide-gray-100">
                  {recentExercises.map((exercise) => (
                    <div key={exercise.id} className="py-3 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{exercise.title}</h3>
                        <p className="text-sm text-gray-500">{exercise.date}</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          exercise.score >= 80 
                            ? 'bg-green-100 text-green-800' 
                            : exercise.score >= 70 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {exercise.score}/100
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <Link 
                  to="/history" 
                  className="text-eloquence-primary hover:text-eloquence-primary/80 text-sm font-medium flex items-center justify-center"
                >
                  Voir tous les exercices <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </Card>
            
            {/* Exercise Categories */}
            <Card className="eloquence-card">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">Catégories d'exercices</h2>
                  <BookOpen size={20} className="text-eloquence-primary" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/training?category=grammar">Grammaire</Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/training?category=vocabulary">Vocabulaire</Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/training?category=articulation">Articulation</Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/training?category=fluidity">Fluidité</Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/training?category=persuasion">Persuasion</Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/training?category=intonation">Intonation</Link>
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <Button className="w-full bg-eloquence-accent hover:bg-eloquence-accent/90" asChild>
                  <Link to="/training">
                    Nouvel exercice
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
