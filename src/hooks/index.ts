/**
 * Custom Hooks for Support Insights Analysis
 */

import { useCallback, useState } from 'react';
import OpenRouterService from '../services/OpenRouterService';
import { AnalysisError, AnalysisStatus, GeminiAnalysisResponse, Ticket, normalizeCategory, normalizeStatus, parseDate } from '../types';
<<<<<<< HEAD
=======
import { SafeStorage } from '../utils/safeStorage';
>>>>>>> 6babdba (changes)

export interface UseGeminiAnalysisResult {
  analysis: GeminiAnalysisResponse | null;
  status: AnalysisStatus;
  error: AnalysisError | null;
  analyzeTickets: (tickets: Ticket[]) => Promise<void>;
  reset: () => void;
  setApiKey: (key: string) => void;
}

/**
 * Custom hook for OpenRouter AI analysis (FREE alternative)
 * 
 * @param initialApiKey - Optional initial API key
 * @returns Analysis result, status, error handling, and control functions
 */
export function useGeminiAnalysis(initialApiKey?: string): UseGeminiAnalysisResult {
<<<<<<< HEAD
  const [analysis, setAnalysis] = useState<GeminiAnalysisResponse | null>(null);
=======
  // Initialize with cached analysis from localStorage (persists across page refreshes)
  // Using SafeStorage to prevent errors if localStorage is disabled
  const [analysis, setAnalysis] = useState<GeminiAnalysisResponse | null>(() => {
    const cached = SafeStorage.getJSON<GeminiAnalysisResponse>('_cache_analysis', null);
    return cached;
  });
>>>>>>> 6babdba (changes)
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [error, setError] = useState<AnalysisError | null>(null);

  if (initialApiKey) {
    OpenRouterService.setApiKey(initialApiKey);
  }

  const analyzeTickets = useCallback(async (tickets: Ticket[]) => {
    setStatus('loading');
    setError(null);
    setAnalysis(null);

    try {
      if (!OpenRouterService) {
        throw new Error('OpenRouter Service not initialized');
      }

      const result = await OpenRouterService.analyzeTickets(tickets);
      setAnalysis(result);
      setStatus('success');
    } catch (err) {
      const errorObj: AnalysisError = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
        code: err instanceof Error ? err.name : 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString(),
      };
      setError(errorObj);
      setStatus('error');
      console.error('Analysis error:', errorObj);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysis(null);
    setStatus('idle');
    setError(null);
  }, []);

  const setApiKey = useCallback((key: string) => {
    OpenRouterService.setApiKey(key);
    reset();
  }, [reset]);

  return {
    analysis,
    status,
    error,
    analyzeTickets,
    reset,
    setApiKey,
  };
}

/**
 * Custom hook for CSV file parsing
 * 
 * @returns Parsing function and state management
 */
export function useCsvParser() {
<<<<<<< HEAD
  const [parsedData, setParsedData] = useState<Ticket[]>([]);
=======
  // Initialize with cached data from localStorage (persists across page refreshes)
  // Using SafeStorage to prevent errors if localStorage is disabled
  const [parsedData, setParsedData] = useState<Ticket[]>(() => {
    const cached = SafeStorage.getJSON<Ticket[]>('_cache_tickets', []);
    return cached || [];
  });
>>>>>>> 6babdba (changes)
  const [parseError, setParseError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const findHeaderIndex = (headers: string[], ...possibleNames: string[]): number => {
    for (const name of possibleNames) {
      const index = headers.indexOf(name.toLowerCase());
      if (index !== -1) return index;
    }
    return -1;
  };

  const parseFile = useCallback((file: File) => {
    setIsLoading(true);
    setParseError(null);

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const csv = e.target?.result as string;
        
        // Parse CSV manually (simple parsing for common formats)
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const tickets: Ticket[] = [];

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          // Handle quoted CSV values properly
          const values: string[] = [];
          let current = '';
          let insideQuotes = false;

          for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j];
            if (char === '"') {
              insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
              values.push(current.trim().replace(/^"|"$/g, ''));
              current = '';
            } else {
              current += char;
            }
          }
          values.push(current.trim().replace(/^"|"$/g, ''));

          const ticketIdIndex = findHeaderIndex(headers, 'ticket id', 'ticketid', 'id');
          const statusIndex = findHeaderIndex(headers, 'status');
          const categoryIndex = findHeaderIndex(headers, 'category', 'issue_category', 'issuecategory');
          const dateIndex = findHeaderIndex(headers, 'date', 'created_date', 'createddate', 'created_at');
          const priorityIndex = findHeaderIndex(headers, 'priority');
          const descIndex = findHeaderIndex(headers, 'issue description', 'issuedescription', 'description');
          const customerIndex = findHeaderIndex(headers, 'customer name', 'customername', 'customer');
          const productIndex = findHeaderIndex(headers, 'product');

          const ticketId = values[ticketIdIndex] || `T${i}`;
          const dateValue = values[dateIndex] || new Date().toISOString();
          const parsedDate = parseDate(dateValue).toISOString();
          
          const ticket: Ticket = {
            id: ticketId,
            status: normalizeStatus(values[statusIndex] || 'Unknown'),
            category: normalizeCategory(values[categoryIndex] || 'Uncategorized'),
            createdDate: parsedDate,
            lastUpdatedDate: parsedDate,
            priority: values[priorityIndex] || 'Medium',
            title: values[descIndex] || `Ticket ${ticketId}`,
            description: values[descIndex] || '',
            assignee: values[customerIndex] || 'Unassigned',
            product: values[productIndex] || 'General',
          };

          tickets.push(ticket);
        }

        if (tickets.length === 0) {
          throw new Error('No valid tickets found in CSV');
        }

        setParsedData(tickets);
        setIsLoading(false);
      } catch (err) {
        setParseError(err instanceof Error ? err.message : 'Failed to parse CSV');
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setParseError('Failed to read file');
      setIsLoading(false);
    };

    reader.readAsText(file);
  }, []);

  const reset = useCallback(() => {
    setParsedData([]);
    setParseError(null);
  }, []);

  return {
    parsedData,
    parseError,
    isLoading,
    parseFile,
    reset,
  };
}
