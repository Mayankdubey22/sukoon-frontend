import React, { createContext, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config'; // adjust path: use './config' if the file is directly in src/

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef(null);

  const fetchResults = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await axios.get('${API_BASE_URL}/api/songs/search-all', {
        params: { query: searchQuery }
      });
      setResults(response.data.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
    setLoading(false);
  };

  const updateQuery = (newQuery) => {
    setQuery(newQuery);

    if (!newQuery.trim()) {
      setResults(null);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchResults(newQuery);
    }, 400);
  };

  return (
    <SearchContext.Provider value={{ query, results, loading, updateQuery }}>
      {children}
    </SearchContext.Provider>
  );
};