const BASE_URL = process.env.REACT_APP_WEATHER_API_BASE_URL;
const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

/**
 * Checks for a valid US zip code.
 *  - US ZIP codes (5 digits or 5+4 digits)
 * 
 * @param {String} zip 
 * @returns a boolean.
 */
const isValidUSZipCode = (zip) => {
  const zipRegex = /^\d{5}(?:-\d{4})?$/;
  return zipRegex.test(zip);
}

/**
 * Fetches the geocoding data by city name or zip coding using the 
 * openweathermap.org api.
 * 
 * @param {String} searchValue - A city name or zip code.
 * @returns An array of geocoding results.
 */
export const fetchLocationData = async (searchValue) => {
  if (!searchValue) {
    return [];
  }

  // If zip code, try the zip code endpoint
  if (isValidUSZipCode(searchValue)) {
    const response = await fetch(`${BASE_URL}/geo/1.0/zip?zip=${searchValue}&appid=${WEATHER_API_KEY}`);
    if (!response.ok) {
      throw new Error('Error fetching ZIP code data');
    }
    const data = await response.json();
    return [data]; // Nest result in an array
  }

  // Otherwise try to city name endpoint
  const response = await fetch(`${BASE_URL}/geo/1.0/direct?q=${searchValue}&limit=5&appid=${WEATHER_API_KEY}`);
  if (!response.ok) {
    throw new Error('Error fetching city data');
  }
  return await response.json();
}

/**
 * Fetches 5 day weather forecast data from the openweathermap.org
 * api.
 * 
 * @param {Object} coords - Object contianing a lat and lon field.
 * @returns An object of the weather forecast.
 */
export const fetchWeatherData = async (coords) => {
  // Make sure the coords object is not empty first
  if (!coords) {
    return [];
  }
  
  const response = await fetch(`${BASE_URL}/data/2.5/forecast?lat=${coords?.lat}&lon=${coords?.lon}&units=imperial&appid=${WEATHER_API_KEY}`);
  if (!response.ok) {
    throw new Error('Error fetching 5 day weather forecast');
  }
  const data = await response.json();
  return data;
}