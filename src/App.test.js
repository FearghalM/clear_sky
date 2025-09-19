import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the fetch function for testing
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      name: 'Test City',
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      main: { temp: 25, humidity: 60 },
      sys: { sunrise: 1609459200, sunset: 1609495200 }
    }),
  })
);

// Mock environment variables
process.env.REACT_APP_API_URL = 'https://api.openweathermap.org/data/2.5';
process.env.REACT_APP_API_KEY = 'test-api-key';

beforeEach(() => {
  fetch.mockClear();
});

test('renders loading message initially', () => {
  render(<App />);
  const loadingElement = screen.getByText(/loading weather/i);
  expect(loadingElement).toBeInTheDocument();
});
