import React, { useEffect, useState } from "react";
import WeatherCard from "./components/WeatherCard";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [data, setData] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [units, setUnits] = useState('metric'); // 'metric' for °C, 'imperial' for °F
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useGeolocation, setUseGeolocation] = useState(true);

  useEffect(() => {
    if (!useGeolocation) return;
    
    if (!('geolocation' in navigator)) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
        setGeoError(null);
      },
      (error) => {
        setGeoError('Unable to retrieve your location.');
      }
    );
  }, [useGeolocation]);

  const fetchData = async (overrideUnits, customLat, customLong) => {
    const latitude = customLat || lat;
    const longitude = customLong || long;
    
    if (latitude && longitude) {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/weather/?lat=${latitude}&lon=${longitude}&units=${overrideUnits || units}&APPID=${process.env.REACT_APP_API_KEY}`
        );
        const result = await response.json();
        setData(result);
        setGeoError(null);
      } catch (e) {
        setGeoError('Failed to fetch weather data.');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [lat, long, units]);

  const handleOptionChange = (e) => {
    const value = e.target.value;
    if (value === 'celsius') {
      setUnits('metric');
    } else if (value === 'fahrenheit') {
      setUnits('imperial');
    } else if (value === 'details') {
      setShowDetails((prev) => !prev);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleLocationSelect = (location) => {
    setLat(location.lat);
    setLong(location.lon);
    setUseGeolocation(false);
    // Fetch weather data for the selected location
    fetchData(null, location.lat, location.lon);
  };

  return (
    <div className="App">
      <SearchBar 
        onLocationSelect={handleLocationSelect}
        apiKey={process.env.REACT_APP_API_KEY}
      />
      {geoError ? (
        <p className="error">{geoError}</p>
      ) : loading ? (
        <p className="loading">Loading weather...</p>
      ) : data ? (
        <WeatherCard
          weatherData={data}
          units={units}
          showDetails={showDetails}
          onOptionChange={handleOptionChange}
          onRefresh={handleRefresh}
        />
      ) : (
        <p className="loading">Loading weather...</p>
      )}
    </div>
  );
}

export default App;
