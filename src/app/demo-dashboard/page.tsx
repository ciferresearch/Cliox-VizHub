'use client';

import { VizHub } from '../../components/viz-hub';
import { useDataLoader } from './useDataLoader';

export default function DemoDashboard() {
  const { data, isLoading, error } = useDataLoader();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Failed to Load Data</h2>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Data Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Email data visualization and insights
          </p>
        </header>

        {data && (
          <VizHub 
            data={data}
            config={{
              showEmailDistribution: true,
              showDateDistribution: true,
              showSentiment: true,
              showWordCloud: true,
              showDocumentSummary: true,
              showFutureFeatures: false
            }}
            theme="light"
          />
        )}
      </div>
    </div>
  );
} 