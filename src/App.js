import React, { useEffect, useState } from "react";
import WeatherCard from "./components/WeatherCard";
import "./App.css";

function App() {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [data, setData] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [units, setUnits] = useState('metric'); // 'metric' for °C, 'imperial' for °F
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
  }, []);

  const fetchData = async (overrideUnits) => {
    if (lat && long) {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/weather/?lat=${lat}&lon=${long}&units=${overrideUnits || units}&APPID=${process.env.REACT_APP_API_KEY}`
        );
        const result = await response.json();
        setData(result);
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

  return (
    <div className="App">
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
