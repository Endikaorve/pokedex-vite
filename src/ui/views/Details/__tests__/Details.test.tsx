import { screen, waitFor } from '@testing-library/react'
import { Details } from '../Details'
import { mockUrlParams, render } from '@/test/utils'

// Mock de localStorage
const localStorageMock = {
  getItem: vitest.fn(),
  setItem: vitest.fn(),
  removeItem: vitest.fn(),
  clear: vitest.fn(),
}

// Mock de fetch global
const fetchMock = vitest.fn()

describe('Details', () => {
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

  it('should display name of the pokemon', async () => {
    mockUrlParams({ id: '25' })

    // Mock de la respuesta del pokémon
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

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(pikachuData),
    } as Response)

    render(<Details />)

    expect(await screen.findByText(/pikachu/i)).toBeInTheDocument()
  })

  it('should display error when fetch fails', async () => {
    mockUrlParams({ id: '999' })

    fetchMock.mockRejectedValueOnce(new Error('Network error'))

    render(<Details />)

    expect(
      await screen.findByText(/Error al cargar el Pokémon/i)
    ).toBeInTheDocument()
  })

  it('should display error when pokemon does not exist', async () => {
    mockUrlParams({ id: undefined })

    render(<Details />)

    expect(screen.getByText(/El Pokémon no existe/i)).toBeInTheDocument()
  })
})
