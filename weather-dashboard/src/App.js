import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./App.css";

const WeatherApp = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState(null);

  const API_KEY = "ef8c9c988bbe0118d196506cddaa4c19";

  // Fetch suggestions
  const fetchSuggestions = async (value) => {
    setSearch(value);
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`
      );
      const json = await res.json();
      setSuggestions(json);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  // Fetch weather
  const fetchWeather = async () => {
    if (!search.trim()) return alert("Please enter a city");

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${API_KEY}&units=metric`
      );
      const json = await res.json();
      if (json.cod === 200) {
        setData(json);
        setSuggestions([]);
      } else {
        alert("City not found");
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };
  
  // Change background color
  useEffect(() => {
    if (data && data.weather) {
      const condition = data.weather[0].main;

      const backgrounds = {
        Clear: "linear-gradient(to right top, #fbc2eb, #a6c1ee)",
        Clouds: "linear-gradient(to right top, #d7d2cc, #304352)",
        Rain: "linear-gradient(to right top, #4e54c8, #8f94fb)",
        Snow: "linear-gradient(to right top, #e0eafc, #cfdef3)",
        Mist: "linear-gradient(to right top, #c9d6ff, #e2e2e2)",
        Thunderstorm: "linear-gradient(to right top, #373b44, #4286f4)",
        Drizzle: "linear-gradient(to right top, #89f7fe, #66a6ff)",
      };
      document.body.style.background = backgrounds[condition];
    }
  }, [data]);

  return (
    <div className="weather-app">
      <h1 className="title">☀️ SkySnap</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search city"
          value={search}
          onChange={(e) => fetchSuggestions(e.target.value)}
        />
        <button onClick={fetchWeather}>
          <FaSearch />
        </button>
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((item, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setSearch(item.name);
                  setSuggestions([]);
                }}
              >
                {item.name},{item.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      {data && data.weather && (
        <div className="weather-info">
          <h2>{data.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            alt={data.weather[0].description}
          />
          <h1>{Math.round(data.main.temp)}°C</h1>
          <p className="desc">{data.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};
export default WeatherApp;