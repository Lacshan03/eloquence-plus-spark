
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', animated = true }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <span className={`font-poppins font-bold ${sizeClasses[size]} bg-clip-text text-transparent eloquence-gradient ${animated ? 'hover:scale-105 transition-transform duration-300' : ''}`}>
        Éloquence<span className="text-eloquence-accent animate-pulse">+</span>
      </span>
    </Link>
  );
};

export default Logo;
