import { ReactElement } from 'react';
import Link from 'next/link';

interface LogoProps {
  darkMode?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function Logo({ darkMode = false, size = 'medium' }: LogoProps): ReactElement {
  // Map size prop to text size classes
  const textSizeClasses = {
    small: {
      desktop: 'text-xl',
      mobile: 'text-lg'
    },
    medium: {
      desktop: 'text-2xl',
      mobile: 'text-xl'
    },
    large: {
      desktop: 'text-4xl',
      mobile: 'text-3xl'
    }
  };

  const unselectable = 'select-none cursor-pointer';

  return (
    <Link href="/" className="relative">
      {/* Desktop and tablet logo */}
      <div 
        className={`hidden sm:block ${textSizeClasses[size].desktop} font-bold tracking-tight ${unselectable}`}
        style={{ fontFamily: 'var(--font-titillium-web)' }}
      >
        <span className={darkMode ? 'text-blue-100' : 'text-blue-900'}>
          Clio
        </span>
        <span className={darkMode ? 'text-blue-300' : 'text-blue-700'}>X</span>
      </div>
      
      {/* Mobile logo */}
      <div 
        className={`block sm:hidden ${textSizeClasses[size].mobile} font-bold ${unselectable}`}
        style={{ fontFamily: 'var(--font-titillium-web)' }}
      >
        <span className={darkMode ? 'text-blue-100' : 'text-blue-900'}>Clio</span>
        <span className={darkMode ? 'text-blue-300' : 'text-blue-700'}>X</span>
      </div>
    </Link>
  );
} 