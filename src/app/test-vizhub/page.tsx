'use client';

import { useState, useEffect } from 'react';
import { VizHub } from '../../components/viz-hub';
import type { VizHubData } from '../../components/viz-hub';

export default function TestVizHub() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<VizHubData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load real data from samples folder
  useEffect(() => {
    const loadSampleData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load all data files in parallel
        const [
          wordCloudResponse,
          sentimentResponse,
          documentSummaryResponse,
          emailDistributionResponse,
          dateDistributionResponse
        ] = await Promise.all([
          fetch('/samples/wordcloud.json'),
          fetch('/samples/sentiment.json'),
          fetch('/samples/document_summary.json'),
          fetch('/samples/email_distribution.csv'),
          fetch('/samples/date_distribution.csv')
        ]);

        // Check if all requests were successful
        if (!wordCloudResponse.ok || !sentimentResponse.ok || !documentSummaryResponse.ok || 
            !emailDistributionResponse.ok || !dateDistributionResponse.ok) {
          throw new Error('Failed to load one or more data files');
        }

        // Parse JSON data
        const [wordCloudData, sentimentData, documentSummaryData] = await Promise.all([
          wordCloudResponse.json(),
          sentimentResponse.json(),
          documentSummaryResponse.json()
        ]);

        // Parse CSV data
        const [emailDistributionText, dateDistributionText] = await Promise.all([
          emailDistributionResponse.text(),
          dateDistributionResponse.text()
        ]);

        // Parse email distribution CSV (just numbers, one per line after header)
        const emailDistributionLines = emailDistributionText.trim().split('\n');
        const emailDistribution = emailDistributionLines
          .slice(1) // Skip header
          .map(line => ({ emails_per_day: parseInt(line.trim()) }))
          .filter(item => !isNaN(item.emails_per_day));

        // Parse date distribution CSV (time,count format)
        const dateDistributionLines = dateDistributionText.trim().split('\n');
        const dateDistribution = dateDistributionLines
          .slice(1) // Skip header
          .map(line => {
            const [time, count] = line.split(',');
            return { time: time.trim(), count: parseInt(count.trim()) };
          })
          .filter(item => item.time && !isNaN(item.count));

        // Assemble the complete dataset
        const completeData: VizHubData = {
          emailDistribution,
          dateDistribution,
          sentiment: sentimentData,
          wordCloud: wordCloudData,
          documentSummary: documentSummaryData
        };

        setData(completeData);
        console.log('Loaded real sample data:', {
          emailDistribution: emailDistribution.length,
          dateDistribution: dateDistribution.length,
          sentiment: sentimentData.length,
          wordCloudWords: wordCloudData.wordCloudData.length,
          documentSummary: documentSummaryData.totalDocuments
        });

      } catch (err) {
        console.error('Error loading sample data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadSampleData();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Loading Sample Data
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Loading real data from samples/Archive.zip...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Failed to Load Data
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main content - Test all VizHub features with real data
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            🧪 VizHub Component Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Testing with <strong>real Enron email dataset</strong> from samples/Archive.zip
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            {data && (
              <div className="inline-flex gap-4 flex-wrap justify-center">
                <span>📧 {data.emailDistribution?.length || 0} email data points</span>
                <span>📅 {data.dateDistribution?.length || 0} date data points</span>
                <span>💭 {data.sentiment?.length || 0} sentiment categories</span>
                <span>☁️ {data.wordCloud?.wordCloudData?.length || 0} words</span>
                <span>📄 {data.documentSummary?.totalDocuments || 0} documents analyzed</span>
              </div>
            )}
          </div>
        </div>

        {/* VizHub Component Test */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              🎯 All Visualizations Enabled
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Complete VizHub component with all visualization types enabled using real dataset.
            </p>
          </div>

          {data && (
            <VizHub 
              data={data}
              config={{
                showEmailDistribution: true,
                showDateDistribution: true,
                showSentiment: true,
                showWordCloud: true,
                showDocumentSummary: true,
                showFutureFeatures: true
              }}
              theme="light"
              className="border border-gray-100 dark:border-gray-600 rounded-lg"
            />
          )}
        </div>

        {/* Data Summary */}
        <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            📊 Dataset Information
          </h3>
          {data && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                <div className="font-medium text-gray-800 dark:text-gray-200">Email Distribution</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {data.emailDistribution?.length} data points
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Daily email counts over time
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                <div className="font-medium text-gray-800 dark:text-gray-200">Date Distribution</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {data.dateDistribution?.length} time periods
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  From {data.dateDistribution?.[0]?.time} to {data.dateDistribution?.[data.dateDistribution.length - 1]?.time}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                <div className="font-medium text-gray-800 dark:text-gray-200">Sentiment Analysis</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {data.sentiment?.length} sentiment levels
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Time-series sentiment data
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                <div className="font-medium text-gray-800 dark:text-gray-200">Word Cloud</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {data.wordCloud?.wordCloudData?.length} unique words
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Top word: "{data.wordCloud?.wordCloudData?.[0]?.value}" ({data.wordCloud?.wordCloudData?.[0]?.count} occurrences)
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                <div className="font-medium text-gray-800 dark:text-gray-200">Document Summary</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {data.documentSummary?.totalDocuments} documents
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {data.documentSummary?.totalWords} total words, {data.documentSummary?.uniqueWords} unique
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                <div className="font-medium text-gray-800 dark:text-gray-200">Dataset Source</div>
                <div className="text-gray-600 dark:text-gray-400">
                  Enron Email Dataset
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Generated: {data.documentSummary?.created}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 