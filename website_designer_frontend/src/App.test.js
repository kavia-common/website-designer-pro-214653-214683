import { render, screen } from '@testing-library/react';
import App from './App';

test('renders website designer header', () => {
  render(<App />);
  const title = screen.getByText(/website designer/i);
  expect(title).toBeInTheDocument();
});
