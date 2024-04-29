import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { RecentSearchCard } from './RecentSearchCard';

describe('RecentSearchCard', () => {
  const location = {
    name: 'Boston',
    country: 'US',
    lat: 40.7128,
    lon: -74.0060,
  };
  const setCoordsMock = jest.fn();

  it('renders without crashing', () => {
    render(<RecentSearchCard location={location} setCoords={setCoordsMock} />);
  });

  it('renders location name and country', () => {
    const { getByText } = render(<RecentSearchCard location={location} setCoords={setCoordsMock} />);
    expect(getByText('Boston, US')).toBeInTheDocument();
  });

  it('calls setCoords when clicked', () => {
    const { container } = render(<RecentSearchCard location={location} setCoords={setCoordsMock} />);
    fireEvent.click(container.firstChild);
    expect(setCoordsMock).toHaveBeenCalledWith({ lat: 40.7128, lon: -74.0060 });
  });
});
