import { describe, expect, it } from 'vitest'
import { mapPokemonDTOToPokemon } from '../mapPokemonDTOToPokemon'
import { PokemonDTO } from '../../dto/Pokemon.dto'
import { PokemonSimplified } from '@/core/Pokemon/domain/Pokemon'

describe('mapPokemonDTOToPokemon', () => {
  it('should map a PokemonDTO to a Pokemon', () => {
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
            front_default: 'https://example.com/image.png',
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
          base_stat: 49,
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
          base_stat: 65,
          stat: {
            name: 'special-defense',
          },
        },
        {
          base_stat: 45,
          stat: {
            name: 'speed',
          },
        },
      ],
    }
    const expected: PokemonSimplified = {
      id: '1',
      name: 'bulbasaur',
      height: 0.7,
      weight: 6.9,
      types: ['grass', 'poison'],
      images: {
        main: 'https://example.com/image.png',
        alt: 'https://example.com/image.png',
      },
      stats: {
        hp: 45,
        attack: 49,
        defense: 49,
        specialAttack: 65,
        specialDefense: 65,
        speed: 45,
      },
    }

    const result = mapPokemonDTOToPokemon(pokemonDTO)
    expect(result).toEqual(expected)
  })
})
