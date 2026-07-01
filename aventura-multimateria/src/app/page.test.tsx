import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Dashboard from './page';

jest.mock('./components/I18nProvider', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'dashboard.title': 'ExplorAventura 3',
        'dashboard.subtitle': '7 minijuegos',
        'dashboard.cta': 'Elige un minijuego',
        'dashboard.footer': 'Footer',
        'games.puerto-palabras.name': 'Puerto de las Palabras',
        'games.puerto-palabras.description': 'Desc',
        'games.puerto-palabras.subject': 'Lengua',
        'games.bosc-lectura.name': 'Bosc',
        'games.bosc-lectura.description': 'Desc',
        'games.bosc-lectura.subject': 'Lectura',
        'games.mercado-numeros.name': 'Mercado',
        'games.mercado-numeros.description': 'Desc',
        'games.mercado-numeros.subject': 'Mates',
        'games.mision-mapamundi-v2.name': 'Mapamundi',
        'games.mision-mapamundi-v2.description': 'Desc',
        'games.mision-mapamundi-v2.subject': 'Geo',
        'games.desafio-steam.name': 'STEAM',
        'games.desafio-steam.description': 'Desc',
        'games.desafio-steam.subject': 'Prog',
        'games.laboratorio-flip.name': 'Flip',
        'games.laboratorio-flip.description': 'Desc',
        'games.laboratorio-flip.subject': 'Ciencias',
        'games.museo-tiempo.name': 'Museo del Tiempo',
        'games.museo-tiempo.description': 'Desc',
        'games.museo-tiempo.subject': 'Historia',
        'common.play': 'Jugar',
      };
      return map[key] ?? key;
    },
  }),
}));

describe('Dashboard', () => {
  it('muestra el título principal', () => {
    render(<Dashboard />);
    expect(screen.getByText(/ExplorAventura 3/i)).toBeInTheDocument();
  });

  it('muestra los 7 minijuegos', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Puerto de las Palabras/i)).toBeInTheDocument();
    expect(screen.getByText(/Museo del Tiempo/i)).toBeInTheDocument();
  });
});
