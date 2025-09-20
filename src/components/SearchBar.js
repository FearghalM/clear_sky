import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

const SearchBar = ({ onLocationSelect, apiKey }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const searchCities = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    // Demo mode when API key is not properly configured
    if (!apiKey || apiKey === 'demo_key_replace_with_real_key') {
      // Show mock suggestions for demo purposes
      const mockSuggestions = [
        { name: 'New York', country: 'US', state: 'NY', lat: 40.7128, lon: -74.0060, displayName: 'New York, NY, US' },
        { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278, displayName: 'London, GB' },
        { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522, displayName: 'Paris, FR' },
        { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503, displayName: 'Tokyo, JP' },
        { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093, displayName: 'Sydney, AU' }
      ].filter(city => 
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setTimeout(() => {
        setSuggestions(mockSuggestions);
        setShowSuggestions(true);
        setIsLoading(false);
      }, 500); // Simulate API delay
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchQuery)}&limit=5&appid=${apiKey}`
      );
      const results = await response.json();
      
      // Format results to include country for better UX
      const formattedResults = results.map(city => ({
        ...city,
        displayName: `${city.name}, ${city.state ? city.state + ', ' : ''}${city.country}`
      }));
      
      setSuggestions(formattedResults);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching cities:', error);
      setSuggestions([]);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search to avoid excessive API calls
    debounceRef.current = setTimeout(() => {
      searchCities(value);
    }, 300);
  };

  const handleSuggestionClick = (city) => {
    setQuery(city.displayName);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Call the parent callback with coordinates
    onLocationSelect({
      lat: city.lat,
      lon: city.lon,
      name: city.name,
      country: city.country,
      state: city.state
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for a city..."
            className="search-input"
            onFocus={() => query && suggestions.length > 0 && setShowSuggestions(true)}
          />
          <button type="submit" className="search-button">
            🔍
          </button>
        </div>
      </form>
      
      {showSuggestions && (
        <div className="suggestions-dropdown">
          {isLoading ? (
            <div className="suggestion-item loading">Searching...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((city, index) => (
              <div
                key={`${city.lat}-${city.lon}-${index}`}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(city)}
              >
                {city.displayName}
              </div>
            ))
          ) : query && (
            <div className="suggestion-item no-results">No cities found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;