import { apiClient } from '@/core/_clients/apiClient'
import { describe, expect, it, vitest } from 'vitest'
import { pokemonApiRepository } from '../Pokemon.api.repository'
import { PokemonDTO } from '../dto/Pokemon.dto'
import { PokemonSimplified } from '@/core/Pokemon/domain/Pokemon'

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

const pokemonSimpified: PokemonSimplified = {
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
}

describe('Pokemon.api.repository', () => {
  describe('listByGeneration', () => {
    it('should list pokemons by generation', async () => {
      vitest
        .spyOn(apiClient, 'get')
        .mockResolvedValueOnce({ results: [{ url: 'url1' }] })
        .mockResolvedValueOnce(pokemonDTO)

      const result = await pokemonApiRepository.listByGeneration('Kanto')

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

      expect(result).toEqual([pokemonSimpified])
    })
  })

  describe('getById', () => {
    it('should get a pokemon by id', async () => {
      vitest.spyOn(apiClient, 'get').mockResolvedValue(pokemonDTO)

      const result = await pokemonApiRepository.getById('1')

      expect(apiClient.get).toHaveBeenCalledTimes(1)
      expect(apiClient.get).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/1'
      )

      expect(result).toEqual(pokemonSimpified)
    })
  })
})
