import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from './SearchBar';

// Mock fetch
global.fetch = jest.fn();

describe('SearchBar', () => {
  const mockOnLocationSelect = jest.fn();
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    fetch.mockClear();
    mockOnLocationSelect.mockClear();
  });

  test('renders search input', () => {
    render(<SearchBar onLocationSelect={mockOnLocationSelect} apiKey={mockApiKey} />);
    
    const searchInput = screen.getByPlaceholderText(/search for a city/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('shows suggestions when typing', async () => {
    const mockCities = [
      { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
      { name: 'London', country: 'CA', state: 'ON', lat: 42.9849, lon: -81.2453 }
    ];

    fetch.mockResolvedValueOnce({
      json: async () => mockCities,
    });

    render(<SearchBar onLocationSelect={mockOnLocationSelect} apiKey={mockApiKey} />);
    
    const searchInput = screen.getByPlaceholderText(/search for a city/i);
    fireEvent.change(searchInput, { target: { value: 'London' } });

    await waitFor(() => {
      expect(screen.getByText('London, GB')).toBeInTheDocument();
      expect(screen.getByText('London, ON, CA')).toBeInTheDocument();
    });
  });

  test('calls onLocationSelect when suggestion is clicked', async () => {
    const mockCities = [
      { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 }
    ];

    fetch.mockResolvedValueOnce({
      json: async () => mockCities,
    });

    render(<SearchBar onLocationSelect={mockOnLocationSelect} apiKey={mockApiKey} />);
    
    const searchInput = screen.getByPlaceholderText(/search for a city/i);
    fireEvent.change(searchInput, { target: { value: 'London' } });

    await waitFor(() => {
      const suggestion = screen.getByText('London, GB');
      fireEvent.click(suggestion);
    });

    expect(mockOnLocationSelect).toHaveBeenCalledWith({
      name: 'London',
      country: 'GB',
      lat: 51.5074,
      lon: -0.1278,
      state: undefined
    });
  });
});