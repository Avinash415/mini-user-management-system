import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

test('renders login form', () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthProvider>
  );
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
});

// Add more: validate errors, etc. (aim for 5+ total across components)