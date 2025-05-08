
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-eloquence-primary to-eloquence-primary/90 text-white py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-6 leading-tight animate-fade-in">
                  Perfectionnez votre éloquence avec l'IA
                </h1>
                <p className="text-xl mb-8 text-gray-100 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  Améliorez votre expression orale et écrite grâce à notre plateforme d'entraînement personnalisée
                  et nos outils d'analyse avancés.
                </p>
                <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <Button asChild size="lg" className="bg-eloquence-accent hover:bg-eloquence-accent/90">
                    <Link to="/signup">
                      Essayer gratuitement <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild size="lg" className="bg-white text-eloquence-primary hover:bg-gray-100">
                    <Link to="/login">Se connecter</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-end animate-scale-in">
                <div className="relative">
                  <div className="absolute -inset-1 bg-eloquence-accent/20 rounded-lg blur"></div>
                  <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-md">
                    <div className="flex items-center mb-4">
                      <Logo size="sm" />
                      <div className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">En direct</div>
                    </div>
                    <p className="text-gray-800 mb-4 italic">"Votre analyse démontre une maîtrise croissante du vocabulaire soutenu, mais je vous suggère de varier davantage la structure de vos phrases."</p>
                    <div className="flex flex-col space-y-2">
                      <div className="bg-eloquence-light rounded-md p-3 text-sm text-gray-700">
                        <strong>Suggestion:</strong> Remplacer "important" par "crucial", "primordial" ou "fondamental"
                      </div>
                      <div className="bg-eloquence-light rounded-md p-3 text-sm text-gray-700">
                        <strong>Progrès:</strong> <span className="text-green-600">+12%</span> sur votre richesse lexicale depuis la dernière session
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">
                Des outils puissants pour progresser
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Notre plateforme utilise l'intelligence artificielle pour analyser votre expression et vous proposer
                des améliorations personnalisées.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="eloquence-card p-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-eloquence-primary/10 text-eloquence-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3">Analyse vocale avancée</h3>
                <p className="text-gray-600">
                  Notre technologie analyse votre débit, votre articulation et votre intonation pour vous aider
                  à améliorer votre éloquence orale.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="eloquence-card p-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-eloquence-secondary/10 text-eloquence-secondary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3">Enrichissement lexical</h3>
                <p className="text-gray-600">
                  Découvrez des synonymes plus riches et élégants pour élever votre niveau de langue et varier
                  votre vocabulaire.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="eloquence-card p-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-eloquence-accent/10 text-eloquence-accent mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3">Suivi de progression</h3>
                <p className="text-gray-600">
                  Visualisez votre évolution au fil du temps grâce à nos graphiques de progression détaillés
                  et personnalisés.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-eloquence-primary rounded-2xl p-8 md:p-12 text-white text-center">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">
                Prêt à améliorer votre éloquence ?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Rejoignez des milliers d'utilisateurs qui ont déjà perfectionné leur expression orale et écrite.
              </p>
              <Button asChild size="lg" className="bg-white text-eloquence-primary hover:bg-gray-100">
                <Link to="/signup">
                  Commencer gratuitement
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
