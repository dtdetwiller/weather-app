/**
 * Reusable helper functions.
 */

/**
 * Returns the correct icon image URL.
 * 
 * @param {Array} weather - The weather array from a forecast list object.
 * @returns URL string
 */
export const getWeatherIconUrl = (weather) => {
  return `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
}

/**
 * Capitalizes the first letter of the given string.
 * 
 * @param {String} str - the string to modify
 * @returns modified string
 */
export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a unix timestamp with timezone to a day string.
 * 
 * @param {Number} unixDate The unix time stamp
 * @param {Number} timezone The timezone offset in seconds
 */
export const convertUnixDateToString = (unixDate, timezone) => {
  let date = new Date(unixDate * 1000);
  date.setUTCSeconds(date.getUTCSeconds() + timezone);

  // Just want the weekday
  const options = {
    weekday: 'long',
  };
  
  const dateString = date.toLocaleString('en-US', options);
  return dateString;
}