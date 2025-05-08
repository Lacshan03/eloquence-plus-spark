
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

interface NavbarProps {
  isLoggedIn?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full py-4 bg-white shadow-sm">
      <div className="container flex justify-between items-center">
        <Logo />

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link 
                to="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/dashboard' 
                    ? 'text-eloquence-primary font-semibold' 
                    : 'text-gray-600 hover:text-eloquence-primary'
                }`}
              >
                Tableau de bord
              </Link>
              <Link 
                to="/training" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/training' 
                    ? 'text-eloquence-primary font-semibold' 
                    : 'text-gray-600 hover:text-eloquence-primary'
                }`}
              >
                Entraînement
              </Link>
              <Link 
                to="/history" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/history' 
                    ? 'text-eloquence-primary font-semibold' 
                    : 'text-gray-600 hover:text-eloquence-primary'
                }`}
              >
                Historique
              </Link>
              <Link 
                to="/settings" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/settings' 
                    ? 'text-eloquence-primary font-semibold' 
                    : 'text-gray-600 hover:text-eloquence-primary'
                }`}
              >
                Paramètres
              </Link>
              <Button variant="outline" asChild>
                <Link to="/logout">Déconnexion</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Se connecter</Link>
              </Button>
              <Button className="bg-eloquence-accent hover:bg-eloquence-accent/90" asChild>
                <Link to="/signup">S'inscrire</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 inset-x-0 z-50 bg-white shadow-lg rounded-b-lg p-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {isLoggedIn ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/dashboard' 
                        ? 'text-eloquence-primary font-semibold' 
                        : 'text-gray-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tableau de bord
                  </Link>
                  <Link 
                    to="/training" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/training' 
                        ? 'text-eloquence-primary font-semibold' 
                        : 'text-gray-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entraînement
                  </Link>
                  <Link 
                    to="/history" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/history' 
                        ? 'text-eloquence-primary font-semibold' 
                        : 'text-gray-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Historique
                  </Link>
                  <Link 
                    to="/settings" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/settings' 
                        ? 'text-eloquence-primary font-semibold' 
                        : 'text-gray-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Paramètres
                  </Link>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/logout" onClick={() => setIsMenuOpen(false)}>Déconnexion</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>Se connecter</Link>
                  </Button>
                  <Button className="bg-eloquence-accent hover:bg-eloquence-accent/90 w-full" asChild>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>S'inscrire</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
