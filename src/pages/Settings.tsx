
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Onglet Compte
  const [name, setName] = useState('Utilisateur');
  const [email, setEmail] = useState('utilisateur@exemple.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Onglet Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [progressSummary, setProgressSummary] = useState(true);
  const [newExercises, setNewExercises] = useState(false);
  const [tips, setTips] = useState(true);
  
  // Onglet Préférences
  const [language, setLanguage] = useState('fr');
  const [exerciseLevel, setExerciseLevel] = useState('medium');
  const [autoCorrection, setAutoCorrection] = useState(false);
  const [voiceType, setVoiceType] = useState('feminine');
  
  // Plan Premium
  const [isPremium, setIsPremium] = useState(false);
  
  const saveAccountSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simulation d'une mise à jour réussie
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Paramètres enregistrés",
        description: "Vos informations de compte ont été mises à jour avec succès.",
      });
      
      // Réinitialisation des champs de mot de passe
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de vos informations.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const saveNotificationSettings = async () => {
    try {
      // Simulation d'une mise à jour réussie
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Préférences de notification mises à jour",
        description: "Vos préférences de notification ont été enregistrées.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de vos préférences.",
        variant: "destructive"
      });
    }
  };
  
  const savePreferences = async () => {
    try {
      // Simulation d'une mise à jour réussie
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences d'exercices ont été enregistrées.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de vos préférences.",
        variant: "destructive"
      });
    }
  };
  
  const upgradeToPremium = () => {
    // Simulation d'une mise à niveau vers Premium
    setIsPremium(true);
    
    toast({
      title: "Félicitations !",
      description: "Vous êtes maintenant abonné au plan Premium !",
    });
  };
  
  const logout = () => {
    // Simulation de la déconnexion
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès.",
    });
    
    navigate('/');
  };
  
  const premiumFeatures = [
    "Analyse vocale avancée et détaillée",
    "Exercices personnalisés illimités",
    "Suggestions de vocabulaire étendues",
    "Transcription audio illimitée",
    "Exercices spécifiques par domaine professionnel",
    "Accès prioritaire aux nouvelles fonctionnalités"
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={true} />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container">
          <h1 className="text-3xl font-poppins font-bold mb-2">Paramètres</h1>
          <p className="text-gray-600 mb-8">Gérez votre compte et vos préférences</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="account">Compte</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="preferences">Préférences</TabsTrigger>
                </TabsList>
                
                <TabsContent value="account" className="animate-fade-in mt-6">
                  <Card className="eloquence-card">
                    <form onSubmit={saveAccountSettings} className="p-6">
                      <h2 className="text-xl font-medium mb-6">Informations personnelles</h2>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700">
                              Nom
                            </label>
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Votre nom"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <Input
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="votre@email.com"
                              type="email"
                            />
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <h3 className="text-lg font-medium mb-4">Changer de mot de passe</h3>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                                Mot de passe actuel
                              </label>
                              <div className="relative">
                                <Input
                                  id="currentPassword"
                                  type={showPassword ? "text" : "password"}
                                  value={currentPassword}
                                  onChange={(e) => setCurrentPassword(e.target.value)}
                                  placeholder="••••••••"
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                  onClick={() => setShowPassword(!showPassword)}
                                  tabIndex={-1}
                                >
                                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                                  Nouveau mot de passe
                                </label>
                                <Input
                                  id="newPassword"
                                  type={showPassword ? "text" : "password"}
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  placeholder="••••••••"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                  Confirmer le nouveau mot de passe
                                </label>
                                <Input
                                  id="confirmPassword"
                                  type={showPassword ? "text" : "password"}
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  placeholder="••••••••"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-6">
                        <Button type="submit" className="bg-eloquence-primary hover:bg-eloquence-primary/90" disabled={isSaving}>
                          {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
                        </Button>
                      </div>
                    </form>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications" className="animate-fade-in mt-6">
                  <Card className="eloquence-card p-6">
                    <h2 className="text-xl font-medium mb-6">Préférences de notification</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Notifications par email</h3>
                          <p className="text-sm text-gray-600">Recevoir des mises à jour par email</p>
                        </div>
                        <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Résumé hebdomadaire des progrès</h3>
                          <p className="text-sm text-gray-600">Recevoir un rapport de progression chaque semaine</p>
                        </div>
                        <Switch checked={progressSummary} onCheckedChange={setProgressSummary} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Nouveaux exercices</h3>
                          <p className="text-sm text-gray-600">Être informé des nouveaux exercices disponibles</p>
                        </div>
                        <Switch checked={newExercises} onCheckedChange={setNewExercises} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Conseils et astuces</h3>
                          <p className="text-sm text-gray-600">Recevoir des conseils pour améliorer votre éloquence</p>
                        </div>
                        <Switch checked={tips} onCheckedChange={setTips} />
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button onClick={saveNotificationSettings} className="bg-eloquence-primary hover:bg-eloquence-primary/90">
                        Enregistrer les préférences
                      </Button>
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="preferences" className="animate-fade-in mt-6">
                  <Card className="eloquence-card p-6">
                    <h2 className="text-xl font-medium mb-6">Préférences d'exercices</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="language" className="text-sm font-medium text-gray-700">
                          Langue principale
                        </label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger id="language" className="w-full">
                            <SelectValue placeholder="Sélectionner une langue" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="en">Anglais</SelectItem>
                            <SelectItem value="es">Espagnol</SelectItem>
                            <SelectItem value="de">Allemand</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="exerciseLevel" className="text-sm font-medium text-gray-700">
                          Niveau de difficulté des exercices
                        </label>
                        <Select value={exerciseLevel} onValueChange={setExerciseLevel}>
                          <SelectTrigger id="exerciseLevel" className="w-full">
                            <SelectValue placeholder="Sélectionner un niveau" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Débutant</SelectItem>
                            <SelectItem value="medium">Intermédiaire</SelectItem>
                            <SelectItem value="advanced">Avancé</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Correction audio automatique</h3>
                          <p className="text-sm text-gray-600">Activer les corrections vocales en temps réel</p>
                        </div>
                        <Switch checked={autoCorrection} onCheckedChange={setAutoCorrection} />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="voiceType" className="text-sm font-medium text-gray-700">
                          Type de voix pour les instructions
                        </label>
                        <Select value={voiceType} onValueChange={setVoiceType}>
                          <SelectTrigger id="voiceType" className="w-full">
                            <SelectValue placeholder="Sélectionner un type de voix" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="feminine">Féminine</SelectItem>
                            <SelectItem value="masculine">Masculine</SelectItem>
                            <SelectItem value="neutral">Neutre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button onClick={savePreferences} className="bg-eloquence-primary hover:bg-eloquence-primary/90">
                        Enregistrer les préférences
                      </Button>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="mt-8">
                <Card className="eloquence-card p-6">
                  <h2 className="text-xl font-medium mb-4">Déconnexion</h2>
                  <p className="text-gray-600 mb-4">
                    Vous serez déconnecté de votre compte sur cet appareil.
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={logout}
                  >
                    Se déconnecter
                  </Button>
                </Card>
              </div>
            </div>
            
            <div>
              <Card className={`eloquence-card overflow-hidden ${isPremium ? 'border-2 border-eloquence-accent' : ''}`}>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium">
                      {isPremium ? "Plan Premium" : "Passer au Premium"}
                    </h2>
                    {isPremium && (
                      <span className="bg-eloquence-accent text-white text-xs px-3 py-1 rounded-full">Actif</span>
                    )}
                  </div>
                  
                  {isPremium ? (
                    <div className="text-gray-600 mb-6">
                      <p className="mb-2">Vous bénéficiez actuellement de toutes les fonctionnalités premium.</p>
                      <p className="text-sm">Votre abonnement se renouvellera le 12 juin 2024</p>
                    </div>
                  ) : (
                    <p className="text-gray-600 mb-6">
                      Améliorez votre expérience et progressez plus rapidement avec notre plan Premium.
                    </p>
                  )}
                  
                  <div className="space-y-3 mb-6">
                    {premiumFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className={`flex-shrink-0 mt-1 ${isPremium ? 'text-eloquence-accent' : 'text-gray-400'}`}>
                          {isPremium ? (
                            <CheckCircle size={16} />
                          ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <span className="ml-2 text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {!isPremium && (
                    <div className="bg-eloquence-light p-4 rounded-md mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Abonnement mensuel</span>
                        <span className="font-semibold">9,99 €/mois</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Accès à toutes les fonctionnalités Premium, annulation à tout moment.
                      </p>
                    </div>
                  )}
                  
                  {!isPremium ? (
                    <Button 
                      className="w-full bg-eloquence-accent hover:bg-eloquence-accent/90"
                      onClick={upgradeToPremium}
                    >
                      Passer au Premium
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full">
                      Gérer mon abonnement
                    </Button>
                  )}
                </div>
              </Card>
              
              <Card className="eloquence-card p-6 mt-6">
                <h2 className="text-xl font-medium mb-4">Besoin d'aide ?</h2>
                <p className="text-gray-600 mb-4">
                  Notre équipe de support est disponible pour répondre à vos questions.
                </p>
                <Button variant="outline" className="w-full">
                  Contacter le support
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
