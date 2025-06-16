import { fireEvent, screen } from '@testing-library/react'
import { Home } from '../Home'
import { render, serviceMockBuilder } from '@/test/utils'
import { pokemonService } from '@/core/Pokemon/services/Pokemon.service'
import { pokemonBuilder } from '@/core/Pokemon/domain/__builders__/Pokemon.builder'

describe('Home', () => {
  it('muestra el listado de pokemons', async () => {
    serviceMockBuilder(pokemonService, 'listByGeneration')
      .withValue([
        pokemonBuilder({
          id: '1',
          name: 'Pikachu',
          stats: {
            hp: 100,
            attack: 100,
            defense: 100,
            specialAttack: 100,
            specialDefense: 100,
            speed: 100,
          },
        }).build(),
        pokemonBuilder({
          id: '2',
          name: 'Charmander',
          stats: {
            hp: 100,
            attack: 100,
            defense: 100,
            specialAttack: 100,
            specialDefense: 100,
            speed: 100,
          },
        }).build(),
      ])
      .build()

    render(<Home />)

    expect(await screen.findByText(/Pikachu/i)).toBeInTheDocument()
    expect(screen.getByText(/Charmander/i)).toBeInTheDocument()
  })

  it('muestra un mensaje de error si falla la carga de pokemons', async () => {
    serviceMockBuilder(pokemonService, 'listByGeneration')
      .withError(new Error('Error al cargar los Pokémons'))
      .build()

    render(<Home />)

    expect(
      await screen.findByText(/Error al cargar los Pokémons/i)
    ).toBeInTheDocument()
  })

  it('permite filtrar pokemons por nombre', async () => {
    serviceMockBuilder(pokemonService, 'listByGeneration')
      .withValue([
        pokemonBuilder({
          id: '1',
          name: 'Pikachu',
          stats: {
            hp: 100,
            attack: 100,
            defense: 100,
            specialAttack: 100,
            specialDefense: 100,
            speed: 100,
          },
        }).build(),
        pokemonBuilder({
          id: '2',
          name: 'Charmander',
          stats: {
            hp: 100,
            attack: 100,
            defense: 100,
            specialAttack: 100,
            specialDefense: 100,
            speed: 100,
          },
        }).build(),
      ])
      .build()

    render(<Home />)

    expect(await screen.findByText(/Pikachu/i)).toBeInTheDocument()
    expect(screen.getByText(/Charmander/i)).toBeInTheDocument()

    const input = screen.getByPlaceholderText('Filter by name, type...')
    fireEvent.change(input, { target: { value: 'Pika' } })

    expect(screen.getByText(/Pikachu/i)).toBeInTheDocument()
    expect(screen.queryByText(/Charmander/i)).not.toBeInTheDocument()
  })
})
