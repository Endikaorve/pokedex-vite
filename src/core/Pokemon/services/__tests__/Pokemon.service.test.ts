import { pokemonService, setPokemonRepository } from '../Pokemon.service'
import { Pokemon } from '../../domain/Pokemon'
import { PokemonRepository } from '../../domain/PokemonRepository'

const pokemons: Pokemon[] = [
  {
    id: '1',
    name: 'bulbasaur',
    height: 0.7,
    weight: 6.9,
    types: ['grass', 'poison'],
    images: {
      main: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      alt: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg',
    },
    stats: {
      hp: 45,
      attack: 49,
      defense: 49,
      specialAttack: 65,
      specialDefense: 65,
      speed: 45,
    },
    isFavorite: true,
  },
  {
    id: '2',
    name: 'ivysaur',
    height: 1,
    weight: 13,
    types: ['grass', 'poison'],
    images: {
      main: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png',
      alt: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/2.svg',
    },
    stats: {
      hp: 60,
      attack: 62,
      defense: 63,
      specialAttack: 80,
      specialDefense: 80,
      speed: 60,
    },
    isFavorite: false,
  },
]

describe('PokemonService', () => {
  const mockRepository: PokemonRepository = {
    getById: vitest.fn().mockResolvedValue(pokemons[0]),
    toggleFavorite: vitest.fn(),
    listFavorites: vitest.fn().mockResolvedValue(pokemons),
  }

  beforeEach(() => {
    setPokemonRepository(mockRepository)
    vitest.clearAllMocks()
  })

  describe('getById', () => {
    it('should return a pokemon by id', async () => {
      const result = await pokemonService.getById('1')

      expect(mockRepository.getById).toHaveBeenCalledWith('1')
      expect(result).toStrictEqual(pokemons[0])
    })
  })

  describe('toggleFavorite', () => {
    it('should toggle a pokemon as favorite', () => {
      const pokemon = pokemons[0]

      const result = pokemonService.toggleFavorite(pokemon)

      const expected: Pokemon = {
        ...pokemon,
        isFavorite: false,
      }

      expect(mockRepository.toggleFavorite).toHaveBeenCalledWith(pokemon)
      expect(result).toStrictEqual(expected)
    })
  })

  describe('listFavorites', () => {
    it('should return a list of favorite pokemons', async () => {
      const result = await pokemonService.listFavorites()

      expect(mockRepository.listFavorites).toHaveBeenCalled()
      expect(result).toStrictEqual(pokemons)
    })
  })
})
