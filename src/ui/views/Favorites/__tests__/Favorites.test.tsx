import { screen } from '@testing-library/react'
import { Favorites } from '../Favorites'
import { render, serviceMockBuilder } from '@/test/utils'
import { pokemonService } from '@/core/Pokemon/services/Pokemon.service'
import { pokemonBuilder } from '@/core/Pokemon/domain/__builders__/Pokemon.builder'

describe('Favorites', () => {
  it('muestra el listado de pokémons favoritos', async () => {
    serviceMockBuilder(pokemonService, 'listFavorites')
      .withValue([
        pokemonBuilder({
          id: '25',
          name: 'Pikachu',
          isFavorite: true,
        }).build(),
        pokemonBuilder({
          id: '6',
          name: 'Charizard',
          isFavorite: true,
        }).build(),
      ])
      .build()

    render(<Favorites />)

    expect(await screen.findByText(/Pikachu/i)).toBeInTheDocument()
    expect(screen.getByText(/Charizard/i)).toBeInTheDocument()
  })

  it('muestra un mensaje de error si falla la carga de pokémons favoritos', async () => {
    serviceMockBuilder(pokemonService, 'listFavorites')
      .withError(new Error('Error al cargar los Pokémons Favoritos'))
      .build()

    render(<Favorites />)

    expect(
      await screen.findByText(/Error al cargar los Pokémons Favoritos/i)
    ).toBeInTheDocument()
  })

  it('muestra el botón de análisis cuando hay pokémons favoritos', async () => {
    serviceMockBuilder(pokemonService, 'listFavorites')
      .withValue([
        pokemonBuilder({
          id: '25',
          name: 'Pikachu',
          isFavorite: true,
        }).build(),
      ])
      .build()

    render(<Favorites />)

    expect(await screen.findByText(/Pikachu/i)).toBeInTheDocument()
    expect(screen.getByText(/Analyze Team/i)).toBeInTheDocument()
  })

  it('muestra mensaje de error cuando hay más de 6 pokémons en el equipo', async () => {
    const sevenPokemons = Array.from({ length: 7 }, (_, index) =>
      pokemonBuilder({
        id: `${index + 1}`,
        name: `Pokemon${index + 1}`,
        isFavorite: true,
      }).build()
    )

    serviceMockBuilder(pokemonService, 'listFavorites')
      .withValue(sevenPokemons)
      .build()

    render(<Favorites />)

    expect(await screen.findByText(/Pokemon1/i)).toBeInTheDocument()
    expect(
      screen.getByText(/El equipo no puede tener más de 6 Pokémon/i)
    ).toBeInTheDocument()
  })
})
