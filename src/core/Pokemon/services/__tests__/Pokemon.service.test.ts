import { vitest } from 'vitest'
import { pokemonService } from '../Pokemon.service'
import { Pokemon } from '../../domain/Pokemon'
import { pokemonInfraRepository } from '../../infrastructure/Pokemon.infra.repository'

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
  describe('listByGeneration', async () => {
    it('should return a list of pokemons by generation', async () => {
      vitest
        .spyOn(pokemonInfraRepository, 'listByGeneration')
        .mockResolvedValue(pokemons)

      const result = await pokemonService.listByGeneration('Kanto')

      expect(result).toStrictEqual(pokemons)
    })
  })

  describe('getById', async () => {
    it('should return a pokemon by id', async () => {
      const pokemon = pokemons[0]
      vitest.spyOn(pokemonInfraRepository, 'getById').mockResolvedValue(pokemon)

      const result = await pokemonService.getById('1')

      expect(result).toStrictEqual(pokemon)
    })
  })

  describe('toggleFavorite', async () => {
    it('should toggle a pokemon as favorite', async () => {
      const pokemon = pokemons[0]
      vitest.spyOn(pokemonInfraRepository, 'toggleFavorite')

      const result = pokemonService.toggleFavorite(pokemon)

      const expected: Pokemon = {
        ...pokemon,
        isFavorite: false,
      }

      expect(pokemonInfraRepository.toggleFavorite).toHaveBeenCalledTimes(1)
      expect(result).toStrictEqual(expected)
    })
  })

  describe('listFavorites', async () => {
    it('should return a list of favorite pokemons', async () => {
      vitest
        .spyOn(pokemonInfraRepository, 'listFavorites')
        .mockResolvedValue(pokemons)

      const result = await pokemonService.listFavorites()

      expect(result).toStrictEqual(pokemons)
    })
  })
})
