import React from 'react'
import { convertUnixDateToString, getWeatherIconUrl } from '../utils'

export const ForecastCard = ({ forecast, timezone }) => {

  // Get the high temp for the day
  const tempHigh = Math.round(forecast.main.temp_max);

  return (
    <div className='flex flex-col items-center justify-center py-2 border border-gray-200 rounded-lg min-w-36 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'>
      <div>
        {convertUnixDateToString(forecast.dt, timezone)}
      </div>
      <div className='w-fit'>
        <img src={getWeatherIconUrl(forecast.weather)} />
      </div>
      <div>
        {tempHigh}&deg;F
      </div>
    </div>
  )
}
