import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './page';

describe('Dashboard', () => {
  it('muestra el título principal', () => {
    render(<Dashboard />);
    expect(screen.getByText(/ExplorAventura 3: Minijuegos/i)).toBeInTheDocument();
  });

  it('muestra al menos un minijuego', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Puerto de las Palabras/i)).toBeInTheDocument();
  });
}); 