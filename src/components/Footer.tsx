
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 pt-12 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo className="mb-4" />
            <p className="text-gray-600 max-w-md">
              Améliorez votre éloquence orale et écrite grâce à notre plateforme d'entraînement personnalisée
              et nos outils d'analyse avancés.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/" className="hover:text-eloquence-primary">Accueil</Link></li>
              <li><Link to="/login" className="hover:text-eloquence-primary">Se connecter</Link></li>
              <li><Link to="/signup" className="hover:text-eloquence-primary">S'inscrire</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/about" className="hover:text-eloquence-primary">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-eloquence-primary">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-eloquence-primary">FAQ</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} Éloquence Plus. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
