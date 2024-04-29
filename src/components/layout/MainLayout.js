import React, { useState } from 'react';
import { Search } from '../Search';
import { useQuery } from '@tanstack/react-query';
import { fetchWeatherData } from '../../api';
import { WeatherForecast } from '../WeatherForecast';
import { RecentSearchCard } from '../RecentSearchCard';

export const MainLayout = () => {
  const [coords, setCoords] = useState(null);
  const [recentSearches, setRecentSearches] = useState(JSON.parse(localStorage.getItem('recent-searches')) || []);

  // Query for weather data
  const {
    data: forecast,
    isSuccess
  } = useQuery({
    queryKey: ['weather', `${coords?.lat},${coords?.lon}`],
    queryFn: () => fetchWeatherData(coords),
  });

  // Create recent search cards
  const recentSearchCards = recentSearches.map((recentSearch, index) => (
    <RecentSearchCard key={index} location={recentSearch} setCoords={setCoords} />
  ));
  
  /**
   * Click handler for clearing the recent searches
   */
  const clearRecentSearches = () => {
    localStorage.removeItem('recent-searches');
    setRecentSearches([]);
  }

  return (
    <div className='flex flex-col h-full gap-10'>
      
      {/* Search bar section */}
      <Search setCoords={setCoords} setRecentSearches={setRecentSearches} />
      
      {/* Forecast section */}
      {isSuccess && coords &&
        <WeatherForecast forecast={forecast}/>
      }

      {/* Recent Searches section */}
      {!coords && recentSearches.length > 0 &&
        <div className='flex flex-col gap-2'>
          <div className='text-lg font-bold dark:text-white'>
            Recent Searches <span onClick={clearRecentSearches} className='text-sm font-normal cursor-pointer hover:underline '>Clear</span>
          </div>
          <div className='flex flex-wrap justify-center w-full gap-2 mx-auto'>
            {recentSearchCards}
          </div>
        </div>
      }

      {/* If no recent searches, show helpful text. */}
      {!coords && recentSearches.length === 0 &&
        <div className='text-center'>
          Enter a city name or zip code into the search bar to get start!
        </div>
      }
    </div>
  )
}
