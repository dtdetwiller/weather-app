import React from 'react';
import { render } from '@testing-library/react';
import { ForecastCard } from './ForecastCard';
import { convertUnixDateToString, getWeatherIconUrl } from '../utils';

// Mock the utils functions
jest.mock('../utils', () => ({
  convertUnixDateToString: jest.fn(),
  getWeatherIconUrl: jest.fn(),
}));

describe('ForecastCard', () => {
  const forecast = {
    dt: 1620234000, // Unix timestamp
    main: {
      temp_max: 75, // Maximum temperature
    },
    weather: [{ icon: '01d' }], // Weather icon
  };
  const timezone = 'America/New_York';

  beforeEach(() => {
    convertUnixDateToString.mockReturnValue('Monday, May 5'); // Mocked date string
    getWeatherIconUrl.mockReturnValue('http://example.com/icon.png'); // Mocked icon URL
  });

  it('renders without crashing', () => {
    render(<ForecastCard forecast={forecast} timezone={timezone} />);
  });

  it('renders the correct date', () => {
    const { getByText } = render(<ForecastCard forecast={forecast} timezone={timezone} />);
    expect(getByText('Monday, May 5')).toBeInTheDocument();
  });

  it('renders the correct temperature', () => {
    const { getByText } = render(<ForecastCard forecast={forecast} timezone={timezone} />);
    expect(getByText('75°F')).toBeInTheDocument();
  });
});
