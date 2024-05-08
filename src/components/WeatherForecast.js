import React, { useState } from 'react'
import { ForecastCard } from './ForecastCard';
import { capitalizeFirstLetter, getWeatherIconUrl } from '../utils';

export const WeatherForecast = ({ forecast, coords }) => {
  const [savedLocationButtonText, setSavedLocationButtonText] = new useState('Save');

  // grab the local storage for the saved locations
  const coordsKey = `${coords?.lat},${coords?.lon}`;
  // const initialSavedLocations = JSON.parse(localStorage.getItem('saved-locations')) || [];
  // if (initialSavedLocations.includes(coordsKey)) {
  //   setSavedLocationButtonText('Un-Save');
  // } else {
  //   setSavedLocationButtonText('Save');
  // }

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

  const handleSaveLocation = (e) => {
    let savedLocations = JSON.parse(localStorage.getItem('saved-locations')) || [];
    console.log(savedLocations)
    // Unsave
    if (!savedLocations.includes(coordsKey)) {
      savedLocations.push(coordsKey);
      localStorage.setItem('saved-locations', JSON.stringify(savedLocations));
      setSavedLocationButtonText('Un-Save');
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
          <button className='px-2 border border-gray-300 rounded-md' onClick={(e) => handleSaveLocation(e)} value="">
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
