'use client';

import { useEffect, useState } from 'react';
import SentimentChartV2 from '@/components/SentimentChart_v2';
import DataDistribution from '@/components/DataDistribution';
import WordCloud from '@/components/WordCloud';
import DocumentSummary from '@/components/DocumentSummary';
import UploadPage from '@/components/UploadPage';
import Logo from '@/components/layout/Logo';
import Header from '@/components/layout/Header';
import { STORAGE_KEYS, useDataStore } from '@/store/dataStore';
import { useTheme } from '@/store/themeStore';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { checkDataStatus, dataStatus } = useDataStore();
  const { theme } = useTheme();
  
  // Check for uploaded data
  useEffect(() => {
    const checkData = () => {
      // Check if any of the required data types exists in localStorage
      const dataExists = Object.values(STORAGE_KEYS).some(key => 
        localStorage.getItem(key) !== null
      );
      
      if (dataExists) {
        // Update data status in the store if data exists
        checkDataStatus();
      } else {
        // Auto-open upload modal when no data is present
        setShowUploadModal(true);
      }
      
      setIsLoading(false);
    };
    
    checkData();
    
    // Listen for storage changes in case data is uploaded in another tab
    window.addEventListener('storage', checkData);
    return () => window.removeEventListener('storage', checkData);
  }, [checkDataStatus]);
  
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (showUploadModal) {
      // Save the current overflow style
      const originalOverflow = document.body.style.overflow;
      // Lock scrolling
      document.body.style.overflow = 'hidden';
      
      // Restore scrolling when modal closes
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showUploadModal]);
  
  // Handle successful upload
  const handleUploadSuccess = () => {
    setShowUploadModal(false);
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Empty state component for visualization placeholders
  const EmptyState = ({ title }: { title: string }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-1">No data available to display.</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm">Click the &quot;Upload Data&quot; button in the header to get started.</p>
    </div>
  );
  
  // Render the dashboard with visualizations or empty states
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onUploadClick={() => setShowUploadModal(true)} />
      
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <main>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {dataStatus[STORAGE_KEYS.EMAIL_DISTRIBUTION] ? (
                <DataDistribution
                  title="Data Distribution on Email Counts"
                  description="Shows the distribution of email counts over time"
                  type="email"
                  skipLoading={true}
                  // disableHover={true}
                />
              ) : (
                <EmptyState 
                  title="Email Distribution" 
                />
              )}
              
              {dataStatus[STORAGE_KEYS.DATE_DISTRIBUTION] ? (
                <DataDistribution
                  title="Data Distribution on Date"
                  description="Shows the distribution of emails by date"
                  type="date"
                  skipLoading={true}
                  // disableHover={true}
                />
              ) : (
                <EmptyState 
                  title="Date Distribution" 
                />
              )}
            </div>

            <div className="mb-6">
              {dataStatus[STORAGE_KEYS.SENTIMENT] ? (
                <SentimentChartV2 skipLoading={true} />
              ) : (
                <EmptyState 
                  title="Sentiment Analysis" 
                />
              )}
            </div>

            <div className="mb-6">
              {dataStatus[STORAGE_KEYS.WORD_CLOUD] ? (
                <WordCloud />
              ) : (
                <EmptyState 
                  title="Word Cloud" 
                />
              )}
            </div>

            <div className="mb-6">
              {dataStatus[STORAGE_KEYS.DOCUMENT_SUMMARY] ? (
                <DocumentSummary skipLoading={true} />
              ) : (
                <EmptyState 
                  title="Document Summary" 
                />
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 w-full">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">Further more ...</h2>
              <p className="text-gray-600 dark:text-gray-300">Additional visualizations and analysis tools will be added here.</p>
            </div>
          </main>
        </div>
      </div>
      
      {/* Upload Modal - with dark mode support */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-opacity-20 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-8 py-3 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Upload Visualization Data</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-xl transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <UploadPage onUploadSuccess={handleUploadSuccess} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
