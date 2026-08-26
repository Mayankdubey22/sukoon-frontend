import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounceTimer = useRef(null);
  const requestController = useRef(null);

  const fetchResults = async (searchQuery) => {
    // Cancel the previous request if it is still running.
    requestController.current?.abort();

    const controller = new AbortController();
    requestController.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/songs/search-all`,
        {
          params: { query: searchQuery },
          signal: controller.signal,
        }
      );

      // Ignore the response if this request was cancelled.
      if (controller.signal.aborted) return;

      setResults(response.data?.data || null);
    } catch (error) {
      if (axios.isCancel(error) || error.name === 'CanceledError') {
        return;
      }

      console.error('Search failed:', error);
      setResults(null);
      setError('Unable to load search results. Please try again.');
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const updateQuery = (newQuery) => {
    setQuery(newQuery);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!newQuery.trim()) {
      requestController.current?.abort();
      setResults(null);
      setError(null);
      setLoading(false);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      fetchResults(newQuery.trim());
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      requestController.current?.abort();
    };
  }, []);

  return (
    <SearchContext.Provider
      value={{
        query,
        results,
        loading,
        error,
        updateQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};