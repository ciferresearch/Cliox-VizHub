'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { useTheme } from '@/store/themeStore';

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 mt-2 py-4">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm">
          <div className="flex items-center">
            <Logo darkMode={isDark} size="small" />
            <p className="text-sm text-gray-500 dark:text-gray-400 ml-2">© {new Date().getFullYear()} ClioX</p>
          </div>
          
          <Link href="/under-construction" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Privacy
          </Link>
          
          <Link href="/under-construction" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Contact
          </Link>
          
          <Link href="/under-construction" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Manage cookies
          </Link>
        </div>
      </div>
    </footer>
  );
} 