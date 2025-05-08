
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <span className={`font-poppins font-bold ${sizeClasses[size]} bg-clip-text text-transparent eloquence-gradient`}>
        Éloquence<span className="text-eloquence-accent">+</span>
      </span>
    </Link>
  );
};

export default Logo;
