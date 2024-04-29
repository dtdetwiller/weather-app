import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { fetchLocationData } from '../api';

export const Search = ({ setCoords, setRecentSearches }) => {
  const [searchValue, setSearchValue] = useState('');
  const [resultSelected, setResultSelected] = useState(false);

  // Fetch the location data.
  const {
    data: searchResults,
    isError,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['location', searchValue],
    queryFn: () => fetchLocationData(searchValue),
  });

  /**
   * Handles when a search is submitted.
   * 
   * @param {Event} e - The event object
   */
  const handleSubmit = (e) => {
    setResultSelected(false);
    const element = document.getElementById('search-input');
    setSearchValue(element.value);
  }

  /**
   * 
   * @param {Number} index - The index of the selected search result
   */
  const handleSelect = (index) => {
    const result = searchResults[index];
    const lat = result?.lat;
    const lon = result?.lon;
    setCoords({
      lat,
      lon
    });
    setResultSelected(true);

    // Add to local cache for recent searches
    let recentSearches = JSON.parse(localStorage.getItem('recent-searches')) || [];
    const newSearch = { 
      name: result.name, 
      country: result.country,
      lat,
      lon
    };

    // Check for duplicates based on lat and lon
    const isDuplicate = recentSearches.some(search => search.lat === lat && search.lon === lon);
    
    if (!isDuplicate) {
      recentSearches.push(newSearch);
      recentSearches = recentSearches.slice(0, 10); // limit to 10 searches

      // Save the searches
      localStorage.setItem('recent-searches', JSON.stringify(recentSearches));
      setRecentSearches(recentSearches);
    }
  }

  /**
   * Creates the location string from the given result.
   * 
   * @param {Object} result 
   */
  const getLocationString = (result) => {
    let out = `${result.name}`;
    
    if (result?.state) {
      out += `, ${result.state}`;
    }

    out += `, ${result.country}`;
    return out;
  }

  /**
   * Home click handler that sets the coords to null.
   */
  const handleHomeClick = () => {
    setCoords(null);
  }

  const handleInputChange = () => {
    setResultSelected(true);
  }

  return (
    <div className='relative flex flex-col'>

      {/* Search bar */}
      <div className='flex gap-1'>
        <button 
          onClick={handleHomeClick}
          className='w-fit bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg block p-2.5 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white'>
          Home
        </button>
        <input
          id='search-input'
          type='text' 
          placeholder='Search a city name or zip code'
          className='bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
          onChange={handleInputChange}
        />
        <button onClick={(e) => handleSubmit(e)} className='w-fit bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg block p-2.5 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white'>
          Search
        </button>
      </div>
      
      {/* Handle error from input value */}
      {!resultSelected && isError &&
        <div className='absolute w-full py-5 text-center bg-white border border-gray-200 rounded-lg shadow-md dark:text-white dark:shadow-gray-900 dark:border-gray-700 dark:bg-gray-900 top-14'>
          <span className='font-bold'>{searchValue}</span> is not a city or zip code
        </div>
      }

      {/* Search is loading */}
      {!resultSelected && isLoading && 
        <div role="status" className='absolute flex items-center justify-center w-full py-5 text-center bg-white border border-gray-200 rounded-lg shadow-md dark:shadow-gray-900 dark:border-gray-700 dark:bg-gray-900 top-14 dark:text-white'>
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
      </div>
      }

      {/* Search Results */}
      {!resultSelected && isSuccess && searchResults.length > 0 &&
        <ul className='absolute w-full mt-1 text-center bg-white border border-gray-200 divide-y divide-gray-200 rounded-lg shadow-md dark:divide-gray-700 dark:shadow-gray-800 dark:border-gray-700 dark:bg-gray-900 top-14 dark:text-white'>
          {searchResults.map((result, index) => (
            <li key={index} onClick={() => handleSelect(index)} className='p-3 rounded-lg cursor-pointer dark:text-white hover:bg-gray-100 hover:dark:bg-gray-900'>
              {getLocationString(result)}
            </li>
          ))}
        </ul>
      }

      {/* No results found */}
      {!resultSelected && isSuccess && searchValue && searchResults.length == 0 &&
        <div className='absolute w-full py-5 text-center bg-white border border-gray-200 rounded-lg shadow-md dark:shadow-gray-900 dark:border-gray-700 dark:bg-gray-900 top-14 dark:text-white'>
          No results were found for <span className='font-bold'>{searchValue}</span>
        </div>
      }
    </div>
  )
}
