import { render, screen } from '@testing-library/react';
import App from './App';

test('renders search bar and handles geolocation not supported', () => {
  render(<App />);
  
  // Check if search bar is rendered
  const searchInput = screen.getByPlaceholderText(/search for a city/i);
  expect(searchInput).toBeInTheDocument();
  
  // Should show geolocation error if not supported
  const errorElement = screen.getByText(/geolocation is not supported/i);
  expect(errorElement).toBeInTheDocument();
});
