import { fireEvent, screen, waitFor } from '@testing-library/react'
import { Home } from '../Home'
import { render } from '@/test/utils'

// Mock de localStorage
const localStorageMock = {
  getItem: vitest.fn(),
  setItem: vitest.fn(),
  removeItem: vitest.fn(),
  clear: vitest.fn(),
}

// Mock de fetch global
const fetchMock = vitest.fn()

describe('Home', () => {
  beforeEach(() => {
    // Configurar mocks
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
    globalThis.fetch = fetchMock

    // Reset mocks
    vitest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('[]') // Favoritos vacíos por defecto
  })

  afterEach(() => {
    vitest.restoreAllMocks()
  })

  it('muestra el listado de pokemons', async () => {
    // Mock de la respuesta de la lista de pokémons
    const pokemonListResponse = {
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
      ],
    }

    // Mock de las respuestas individuales de pokémons
    const pikachuData = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      types: [{ slot: 1, type: { name: 'electric' } }],
      sprites: {
        other: {
          'official-artwork': { front_default: 'pikachu-artwork.png' },
          dream_world: { front_default: 'pikachu-dream.png' },
        },
      },
      stats: [
        { base_stat: 35, stat: { name: 'hp' } },
        { base_stat: 55, stat: { name: 'attack' } },
        { base_stat: 40, stat: { name: 'defense' } },
        { base_stat: 50, stat: { name: 'special-attack' } },
        { base_stat: 50, stat: { name: 'special-defense' } },
        { base_stat: 90, stat: { name: 'speed' } },
      ],
    }

    const charmanderData = {
      id: 4,
      name: 'charmander',
      height: 6,
      weight: 85,
      types: [{ slot: 1, type: { name: 'fire' } }],
      sprites: {
        other: {
          'official-artwork': { front_default: 'charmander-artwork.png' },
          dream_world: { front_default: 'charmander-dream.png' },
        },
      },
      stats: [
        { base_stat: 39, stat: { name: 'hp' } },
        { base_stat: 52, stat: { name: 'attack' } },
        { base_stat: 43, stat: { name: 'defense' } },
        { base_stat: 60, stat: { name: 'special-attack' } },
        { base_stat: 50, stat: { name: 'special-defense' } },
        { base_stat: 65, stat: { name: 'speed' } },
      ],
    }

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(pokemonListResponse),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(pikachuData),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(charmanderData),
      } as Response)

    render(<Home />)

    expect(await screen.findByText(/pikachu/i)).toBeInTheDocument()
    expect(screen.getByText(/charmander/i)).toBeInTheDocument()
  })

  it('muestra un mensaje de error si falla la carga de pokemons', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'))

    render(<Home />)

    expect(
      await screen.findByText(/Error al cargar los Pokémons/i)
    ).toBeInTheDocument()
  })

  it('permite filtrar pokemons por nombre', async () => {
    // Mock de la respuesta de la lista de pokémons
    const pokemonListResponse = {
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
      ],
    }

    // Mock de las respuestas individuales de pokémons
    const pikachuData = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      types: [{ slot: 1, type: { name: 'electric' } }],
      sprites: {
        other: {
          'official-artwork': { front_default: 'pikachu-artwork.png' },
          dream_world: { front_default: 'pikachu-dream.png' },
        },
      },
      stats: [
        { base_stat: 100, stat: { name: 'hp' } },
        { base_stat: 100, stat: { name: 'attack' } },
        { base_stat: 100, stat: { name: 'defense' } },
        { base_stat: 100, stat: { name: 'special-attack' } },
        { base_stat: 100, stat: { name: 'special-defense' } },
        { base_stat: 100, stat: { name: 'speed' } },
      ],
    }

    const charmanderData = {
      id: 4,
      name: 'charmander',
      height: 6,
      weight: 85,
      types: [{ slot: 1, type: { name: 'fire' } }],
      sprites: {
        other: {
          'official-artwork': { front_default: 'charmander-artwork.png' },
          dream_world: { front_default: 'charmander-dream.png' },
        },
      },
      stats: [
        { base_stat: 100, stat: { name: 'hp' } },
        { base_stat: 100, stat: { name: 'attack' } },
        { base_stat: 100, stat: { name: 'defense' } },
        { base_stat: 100, stat: { name: 'special-attack' } },
        { base_stat: 100, stat: { name: 'special-defense' } },
        { base_stat: 100, stat: { name: 'speed' } },
      ],
    }

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(pokemonListResponse),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(pikachuData),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(charmanderData),
      } as Response)

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument()
      expect(screen.getByText(/charmander/i)).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText('Filter by name or type')
    fireEvent.change(input, { target: { value: 'pika' } })

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument()
      expect(screen.queryByText(/charmander/i)).not.toBeInTheDocument()
    })
  })
})
