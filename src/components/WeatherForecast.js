import React, { useState, useEffect } from 'react'
import { ForecastCard } from './ForecastCard';
import { capitalizeFirstLetter, getWeatherIconUrl } from '../utils';

export const WeatherForecast = ({ forecast, coords, setSavedLocations }) => {
  const [savedLocationButtonText, setSavedLocationButtonText] = new useState('Save');

  // If location is already saved set the text of the button to un-save
  useEffect(() => {
    let savedLocations = JSON.parse(localStorage.getItem('saved-locations')) || [];
    if (savedLocations.some(l => l.lat === coords.lat && l.lon === coords.lon)) {
      setSavedLocationButtonText('Un-Save');
    }
  }, [coords]);

  // Get the location
  const cityName = forecast.city.name;
  const country = forecast.city.country;
  const timezone = forecast.city.timezone;

  // Get todays weather conditions
  const currentWeather = forecast.list[0];
  const currentTemperature = currentWeather.main.temp;
  const feelsLike = currentWeather.main.feels_like;
  const description = currentWeather.weather[0].description;
  const humidity = currentWeather.main.humidity;
  const windSpeed = currentWeather.wind.speed;

  // Get one list object for each of the 5 days
  const fiveDayForecastData = {};
  forecast.list.forEach((forecastItem) => {
    let date = new Date(forecastItem.dt * 1000);
    date.setUTCSeconds(date.getUTCSeconds() + timezone);

    // Check if the hour falls within the middle of the day range (12 AM to 2 PM)
    const hour = date.getUTCHours();
    if (hour >= 12 && hour <= 14) {
      // Format the date without time
      date = date.toLocaleDateString();
      // Store the forecast item for this date if it doesn't already exist
      if (!fiveDayForecastData[date]) {
        fiveDayForecastData[date] = forecastItem;
      }
    }
  });
  const fiveDayForecast = Object.values(fiveDayForecastData);

  // Get the 5 day forecast cards
  const fiveDayForecastCards = fiveDayForecast.map((day, index) => (
    <ForecastCard key={index} forecast={day} timezone={timezone}/>
  ))

  /**
   * Handler for saving a location
   */
  const handleSaveLocation = (e) => {
    let savedLocations = JSON.parse(localStorage.getItem('saved-locations')) || [];
    const location = { 
      name: cityName, 
      country: country,
      lat: coords.lat,
      lon: coords.lon
    };

    // Check for duplicates based on lat and lon
    const isDuplicate = savedLocations.some(l => l.lat === coords.lat && l.lon === coords.lon);
    
    // Save
    if (!isDuplicate) {
      savedLocations.push(location);
      localStorage.setItem('saved-locations', JSON.stringify(savedLocations));
      setSavedLocationButtonText('Un-Save');
      setSavedLocations(savedLocations);
    // Un-save
    } else {
      savedLocations = savedLocations.filter(l => l.lat != coords.lat && l.lon != coords.lon);
      localStorage.setItem('saved-locations', JSON.stringify(savedLocations));
      setSavedLocationButtonText('Save');
      setSavedLocations(savedLocations);
    }
  }

  return (
    <div className='dark:text-white'>

      {/* Current weather conditions */}
      <div className=''>
        <div className="flex justify-between">
          <div className='text-lg font-bold dark:text-white'>
              Current weather in {cityName}, {country}
          </div>
          <button className='px-2 border border-gray-200 rounded-lg cursor-pointer dark:text-white hover:bg-gray-100 hover:dark:bg-gray-900 dark:border-gray-700 bg-gray-50 dark:bg-gray-900' onClick={(e) => handleSaveLocation(e)} value="">
            {savedLocationButtonText}
          </button>
        </div>
        <div className='flex items-center'>
          {/* Icon */}
          <img src={getWeatherIconUrl(currentWeather.weather)} />

          {/* Temp and description */}
          <div className='flex flex-col'>
            <div className='text-xl'>
              {currentTemperature}&deg;F
            </div>
            <div>
              {capitalizeFirstLetter(description)}
            </div>
          </div>

          {/* Other info */}
          <div className='pl-5'>
            <div className='flex flex-col text-xs'>
              <div>
                Feels like: {feelsLike}&deg;F
              </div>
              <div>
                Humidity: {humidity}%
              </div>
              <div>
                Wind speed: {windSpeed} mph
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day forecast */}
      <div className='flex flex-col gap-5'>
        <div className='text-lg font-bold dark:text-white'>
          5-Day Forecast
        </div>
        <div className='flex gap-2 overflow-x-auto'>
          {fiveDayForecastCards}
        </div>
      </div>
    </div>
  )
}
