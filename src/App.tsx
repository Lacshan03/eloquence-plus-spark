
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { getSession, initAuthListener } from "./services/authService";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Training from "./pages/Training";
import History from "./pages/History";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Création du contexte d'authentification
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true
});

// Composant pour la protection des routes
interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const { user, isLoading } = useContext(AuthContext);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }
  
  return user ? element : <Navigate to="/login" replace />;
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Vérifier la session au chargement
    getSession().then(({ user, session }) => {
      setUser(user);
      setSession(session);
      setIsLoading(false);
    });
    
    // Initialiser l'écouteur d'authentification
    const unsubscribe = initAuthListener((user, session) => {
      setUser(user);
      setSession(session);
      setIsLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, session, isLoading }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/training" element={<ProtectedRoute element={<Training />} />} />
              <Route path="/history" element={<ProtectedRoute element={<History />} />} />
              <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
