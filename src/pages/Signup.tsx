
import React, { useState, useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { signUp } from '@/services/authService';
import { AuthContext } from '@/App';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    
    // Validation de base
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }
    
    // Vérification que les mots de passe correspondent
    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }
    
    // Vérification que le mot de passe est suffisamment fort
    if (password.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit comporter au moins 8 caractères",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { user, error } = await signUp(email, password);
      
      if (error) {
        throw error;
      }
      
      if (user) {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès. Bienvenue sur Éloquence Plus !",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Vérification nécessaire",
          description: "Veuillez vérifier votre boîte mail pour confirmer votre adresse email",
        });
      }
    } catch (error) {
      let message = "Une erreur est survenue lors de l'inscription";
      
      if (error instanceof Error) {
        // Messages d'erreur plus spécifiques
        if (error.message.includes("already registered")) {
          message = "Cet email est déjà utilisé par un autre compte";
        } else if (error.message.includes("password")) {
          message = "Le mot de passe ne respecte pas les critères de sécurité";
        }
      }
      
      toast({
        title: "Erreur d'inscription",
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
            <h1 className="text-2xl font-poppins font-bold">Inscription</h1>
            <p className="text-gray-600 mt-2">Créez votre compte Éloquence Plus</p>
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
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">Au moins 8 caractères</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-eloquence-primary hover:bg-eloquence-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
            </Button>
            
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">
                Vous avez déjà un compte?{' '}
                <Link to="/login" className="text-eloquence-primary hover:underline">
                  Connexion
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

export default Signup;
