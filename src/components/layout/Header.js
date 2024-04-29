import React, { useState } from 'react'

export const Header = () => {
  const [modeText, setModeText] = useState('Light');

  /**
   * Handler for toggling dark mode.
   */
  const toggleDarkMode = (e) => {
    const checked = e.target.checked;
    const element = document.querySelector('html');

    if (checked) {
      element.classList.add('dark');
      setModeText('Dark');
    } else {
      element.classList.remove('dark');
      setModeText('Light');
    }
  }

  return (
    <div className='flex justify-between py-3'>
      <div className='text-lg font-bold text-blue-500 dark:text-blue-400'>
        Weather App
      </div>
      <label className="inline-flex items-center cursor-pointer">
        <input onChange={(e) => toggleDarkMode(e)} type="checkbox" className="sr-only peer" />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className="text-sm font-medium text-gray-900 ms-3 dark:text-gray-300">{modeText}</span>
      </label>
    </div>
  )
}
