import React, { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  weathercode: number;
  windspeed: number;
  winddirection: number;
  time: string; // Add time to the interface
}

const weatherIcons: { [key: number]: string } = {
  0: '☀️', // Clear sky
  1: '🌤️', // Mainly clear
  2: '⛅️', // Partly cloudy
  3: '☁️', // Overcast
  45: '🌫️', // Fog
  48: '🌫️', // Depositing rime fog
  // Add more codes as needed
  71: '❄️', // Snow fall: Slight
  73: '❄️', // Snow fall: Moderate
  75: '❄️', // Snow fall: Heavy
  85: '🌨️', // Snow showers: Slight
  86: '🌨️', // Snow showers: Violent
};

interface WeatherProps {
  setWindSpeed?: (speed: number) => void;
  // Notify parent with snowfall intensity in mm/hr (convert from API unit)
  onSnowfallChange?: (mmPerHour: number) => void;
}

export const Weather: React.FC<WeatherProps> = ({
  setWindSpeed,
  onSnowfallChange,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // --- 1. ADD STATE FOR SNOW DATA ---
  const [snowDepth, setSnowDepth] = useState<number | null>(null);
  const [snowfall, setSnowfall] = useState<number | null>(null);

  useEffect(() => {
    const fetchWeather = () => {
      const latitude = 67.2804;
      const longitude = 14.4049;

      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=snowfall,snow_depth`,
      )
        .then((res) => res.json())
        .then((data) => {
          setWeather(data.current_weather);
          if (setWindSpeed) {
            setWindSpeed(data.current_weather.windspeed);
          }

          // --- 2. THIS IS THE FIX ---

          // Get the current time string from 'current_weather'
          const currentTime = data.current_weather.time;

          // Find the index of that exact time in the 'hourly' time array
          const currentHourIndex = data.hourly.time.findIndex(
            (time: string) => time === currentTime,
          );

          // Check if we found a valid index
          if (currentHourIndex > -1) {
            // Get the snow depth from the 'hourly' array at that index
            // Note: snow_depth is in METERS
            const currentSnowDepth = data.hourly.snow_depth[currentHourIndex];

            // Note: snowfall is in CENTIMETERS per hour per Open-Meteo
            const currentSnowfallCm = data.hourly.snowfall[currentHourIndex];

            // Set the values in state
            setSnowDepth(currentSnowDepth);
            setSnowfall(currentSnowfallCm);

            // Inform parent in mm/hr (cm -> mm)
            if (typeof onSnowfallChange === 'function') {
              const mmPerHour =
                typeof currentSnowfallCm === 'number'
                  ? currentSnowfallCm * 10
                  : 0;
              onSnowfallChange(mmPerHour);
            }

            console.log('Current snow depth (meters):', currentSnowDepth);
            console.log('Snowfall in last hour (cm):', currentSnowfallCm);
          }
          // --- END FIX ---
        })
        .catch(console.error);
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 3600000);
    return () => clearInterval(interval);
  }, [setWindSpeed, onSnowfallChange]);

  if (!weather) {
    return null;
  }

  return (
    <div className="fixed top-5 left-5 bg-gray-900 bg-opacity-60 rounded-lg p-4 text-white text-center">
      {/* You are testing in a different location, so maybe update the title? */}
      <p className="text-lg">Været nå</p>
      <div className="text-5xl my-2">
        {weatherIcons[weather.weathercode] || '🌡️'}
      </div>
      <p className="text-3xl font-bold">{Math.round(weather.temperature)}°C</p>

      {/* {snowDepth !== null && snowDepth > 0 && (
        <p className="text-xl mt-2">
          Snødybde: {Math.round(snowDepth * 100)} cm
        </p>
      )} */}

      {/* Show snowfall if it's a positive number */}
      {/* {snowfall !== null && snowfall > 0 && (
        <p className="text-lg mt-1">Siste time: {snowfall} cm</p>
      )} */}
    </div>
  );
};
