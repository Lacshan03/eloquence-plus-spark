
import React, { useState, useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { signIn } from '@/services/authService';
import { AuthContext } from '@/App';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  
  // Si l'utilisateur est déjà connecté, rediriger vers le tableau de bord
  if (auth.user && !auth.isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { user, error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      if (user) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur Éloquence Plus !",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      let message = "Une erreur est survenue lors de la connexion";
      
      if (error instanceof Error) {
        // Messages d'erreur plus spécifiques
        if (error.message.includes("Invalid login")) {
          message = "Email ou mot de passe incorrect";
        }
      }
      
      toast({
        title: "Erreur de connexion",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <Card className="w-full max-w-md p-8 eloquence-card">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-poppins font-bold">Connexion</h1>
            <p className="text-gray-600 mt-2">Accédez à votre espace Éloquence Plus</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link to="/forgot-password" className="text-sm text-eloquence-primary hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-eloquence-primary hover:bg-eloquence-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
            
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">
                Vous n'avez pas de compte?{' '}
                <Link to="/signup" className="text-eloquence-primary hover:underline">
                  Inscription
                </Link>
              </span>
            </div>
          </form>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
