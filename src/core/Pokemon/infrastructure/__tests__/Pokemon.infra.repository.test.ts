import { apiClient } from '@/core/_clients/apiClient'
import { describe, expect, it, vitest } from 'vitest'
import { pokemonInfraRepository } from '../Pokemon.infra.repository'
import { PokemonDTO } from '../dto/Pokemon.dto'
import { Pokemon } from '@/core/Pokemon/domain/Pokemon'
import { localStorageClient } from '@/core/_clients/localStorageClient'

const pokemonDTO: PokemonDTO = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  types: [
    {
      slot: 1,
      type: {
        name: 'grass',
      },
    },
    {
      slot: 2,
      type: {
        name: 'poison',
      },
    },
  ],
  sprites: {
    other: {
      'official-artwork': {
        front_default: 'https://example.com/image.png',
      },
      dream_world: {
        front_default: 'https://example.com/image2.png',
      },
    },
  },
  stats: [
    {
      base_stat: 45,
      stat: {
        name: 'hp',
      },
    },
    {
      base_stat: 49,
      stat: {
        name: 'attack',
      },
    },
    {
      base_stat: 50,
      stat: {
        name: 'defense',
      },
    },
    {
      base_stat: 65,
      stat: {
        name: 'special-attack',
      },
    },
    {
      base_stat: 67,
      stat: {
        name: 'special-defense',
      },
    },
    {
      base_stat: 69,
      stat: {
        name: 'speed',
      },
    },
  ],
}

const pokemon: Pokemon = {
  id: '1',
  name: 'bulbasaur',
  height: 0.7,
  weight: 6.9,
  types: ['grass', 'poison'],
  images: {
    main: 'https://example.com/image.png',
    alt: 'https://example.com/image2.png',
  },
  stats: {
    hp: 45,
    attack: 49,
    defense: 50,
    specialAttack: 65,
    specialDefense: 67,
    speed: 69,
  },
  isFavorite: false,
}

describe('Pokemon.infra.repository', () => {
  describe('listByGeneration', () => {
    it('should list pokemons by generation', async () => {
      vitest.spyOn(localStorageClient, 'get').mockReturnValueOnce([])
      vitest
        .spyOn(apiClient, 'get')
        .mockResolvedValueOnce({ results: [{ url: 'url1' }] })
        .mockResolvedValueOnce(pokemonDTO)

      const result = await pokemonInfraRepository.listByGeneration('Kanto')

      expect(localStorageClient.get).toHaveBeenCalledTimes(1)
      expect(apiClient.get).toHaveBeenCalledTimes(2)
      expect(apiClient.get).toHaveBeenNthCalledWith(
        1,
        'https://pokeapi.co/api/v2/pokemon',
        {
          params: {
            offset: 0,
            limit: 151,
          },
        }
      )
      expect(apiClient.get).toHaveBeenNthCalledWith(2, 'url1')

      expect(result).toEqual([pokemon])
    })
  })

  describe('getById', () => {
    it('should get a pokemon by id', async () => {
      vitest.spyOn(localStorageClient, 'get').mockReturnValueOnce([])
      vitest.spyOn(apiClient, 'get').mockResolvedValue(pokemonDTO)

      const result = await pokemonInfraRepository.getById('1')

      expect(localStorageClient.get).toHaveBeenCalledTimes(1)
      expect(apiClient.get).toHaveBeenCalledTimes(1)
      expect(apiClient.get).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/1'
      )

      expect(result).toEqual(pokemon)
    })
  })

  describe('toggleFavorite', () => {
    it('should toggle favorite', async () => {
      vitest.spyOn(localStorageClient, 'get').mockReturnValueOnce([])
      vitest.spyOn(localStorageClient, 'set')

      pokemonInfraRepository.toggleFavorite(pokemon)

      expect(localStorageClient.set).toHaveBeenCalledTimes(1)
      expect(localStorageClient.set).toHaveBeenCalledWith('favorites', ['1'])
    })
  })

  describe('listFavorites', () => {
    it('when no favorites', async () => {
      vitest.spyOn(localStorageClient, 'get').mockReturnValueOnce([])
      vitest.spyOn(apiClient, 'get')

      const result = await pokemonInfraRepository.listFavorites()

      expect(localStorageClient.get).toHaveBeenCalledTimes(1)
      expect(apiClient.get).toHaveBeenCalledTimes(0)
      expect(result).toEqual([])
    })

    it('list favorites', async () => {
      vitest.spyOn(localStorageClient, 'get').mockReturnValueOnce(['1'])
      vitest.spyOn(apiClient, 'get').mockResolvedValueOnce(pokemonDTO)

      const result = await pokemonInfraRepository.listFavorites()

      expect(localStorageClient.get).toHaveBeenCalledTimes(1)
      expect(apiClient.get).toHaveBeenCalledTimes(1)
      expect(result).toEqual([
        {
          ...pokemon,
          isFavorite: true,
        },
      ])
    })
  })
})
