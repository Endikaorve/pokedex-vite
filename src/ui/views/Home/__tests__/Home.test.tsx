import { fireEvent, screen } from '@testing-library/react'
import { Home } from '../Home'
import { afterEach, describe, expect, it, vitest } from 'vitest'
import { render, serviceMockBuilder } from '@/test/utils'
import { pokemonService } from '@/core/Pokemon/services/Pokemon.service'
import { pokemonBuilder } from '@/core/Pokemon/domain/__builders__/Pokemon.builder'

describe('Home', () => {
  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('muestra el listado de pokemons', async () => {
    serviceMockBuilder(pokemonService, 'listByGeneration')
      .withValue([
        pokemonBuilder({
          id: '1',
          name: 'Pikachu',
        }).build(),
        pokemonBuilder({
          id: '2',
          name: 'Charmander',
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
        }).build(),
        pokemonBuilder({
          id: '2',
          name: 'Charmander',
        }).build(),
      ])
      .build()

    render(<Home />)

    expect(await screen.findByText(/Pikachu/i)).toBeInTheDocument()
    expect(screen.getByText(/Charmander/i)).toBeInTheDocument()

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Pika' } })

    expect(screen.getByText(/Pikachu/i)).toBeInTheDocument()
    expect(screen.queryByText(/Charmander/i)).not.toBeInTheDocument()
  })
})
