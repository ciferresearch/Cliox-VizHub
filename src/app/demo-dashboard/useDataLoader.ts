import { useState, useEffect } from 'react';
import type { VizHubData } from '../../components/viz-hub';

export interface DataLoadingState {
  data: VizHubData | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for loading sample data
 * Separates data fetching logic from UI components
 */
export function useDataLoader(): DataLoadingState {
  const [state, setState] = useState<DataLoadingState>({
    data: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

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
        const responses = [
          wordCloudResponse,
          sentimentResponse, 
          documentSummaryResponse,
          emailDistributionResponse,
          dateDistributionResponse
        ];

        if (responses.some(response => !response.ok)) {
          throw new Error('Failed to load data files');
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

        // Parse email distribution CSV
        const emailDistributionLines = emailDistributionText.trim().split('\n');
        const emailDistribution = emailDistributionLines
          .slice(1) // Skip header
          .map(line => ({ emails_per_day: parseInt(line.trim()) }))
          .filter(item => !isNaN(item.emails_per_day));

        // Parse date distribution CSV
        const dateDistributionLines = dateDistributionText.trim().split('\n');
        const dateDistribution = dateDistributionLines
          .slice(1) // Skip header
          .map(line => {
            const [time, count] = line.split(',');
            return { time: time.trim(), count: parseInt(count.trim()) };
          })
          .filter(item => item.time && !isNaN(item.count));

        // Assemble complete dataset
        const completeData: VizHubData = {
          emailDistribution,
          dateDistribution,
          sentiment: sentimentData,
          wordCloud: wordCloudData,
          documentSummary: documentSummaryData
        };

        setState({
          data: completeData,
          isLoading: false,
          error: null
        });

      } catch (err) {
        setState({
          data: null,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Unknown error occurred'
        });
      }
    };

    loadData();
  }, []);

  return state;
} 