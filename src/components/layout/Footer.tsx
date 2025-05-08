'use client';

import React from 'react';
import Logo from './Logo';
import { useTheme } from '@/store/themeStore';

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 pt-8 pb-6">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <Logo darkMode={isDark} size="small" />
          <p className="text-sm text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} ClioX</p>
        </div>
      </div>
    </footer>
  );
} 