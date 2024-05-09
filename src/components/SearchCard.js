import React from 'react'

export const SearchCard = ({ location, setCoords }) => {

  /**
   * Click handler for selecting the recent search.
   */
  const handleSelect = () => {
    setCoords({
      lat: location.lat,
      lon: location.lon
    })
  }

  return (
    <div 
      onClick={handleSelect}
      className='w-full md:w-[47%] md:min-w-80 px-5 dark:text-white cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-900 py-2 border border-gray-200 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-900'>
      {location.name}, {location.country}
    </div>
  )
}
