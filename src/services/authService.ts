
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

// Fonction pour vérifier et récupérer la session
export async function getSession(): Promise<{user: User | null, session: Session | null}> {
  const { data } = await supabase.auth.getSession();
  return { 
    user: data.session?.user || null, 
    session: data.session 
  };
}

// Fonction pour s'inscrire avec email et mot de passe
export async function signUp(email: string, password: string): Promise<{
  user: User | null,
  error: Error | null
}> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) {
      throw error;
    }
    
    return { user: data?.user || null, error: null };
  } catch (err) {
    console.error("Erreur d'inscription:", err);
    return { user: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// Fonction pour se connecter avec email et mot de passe
export async function signIn(email: string, password: string): Promise<{
  user: User | null,
  error: Error | null
}> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      throw error;
    }
    
    return { user: data?.user || null, error: null };
  } catch (err) {
    console.error("Erreur de connexion:", err);
    return { user: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// Fonction pour se déconnecter
export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    return { error: null };
  } catch (err) {
    console.error("Erreur de déconnexion:", err);
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// Hook pour gérer l'écoute des changements d'authentification
export function initAuthListener(callback: (user: User | null, session: Session | null) => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null, session);
  });

  return () => subscription.unsubscribe();
}
