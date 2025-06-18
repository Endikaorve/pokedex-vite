import { useState, useEffect } from 'react'

import { Pokemon, PokemonGeneration } from '@/core/Pokemon/domain/Pokemon'
import { buildPokemon } from './utils/buildPokemon'

const pokemonGenerations: Record<
  PokemonGeneration,
  {
    offset: number
    limit: number
  }
> = {
  Kanto: {
    offset: 0,
    limit: 151,
  },
  Johto: {
    offset: 151,
    limit: 100,
  },
  Hoenn: {
    offset: 251,
    limit: 135,
  },
  Sinnoh: {
    offset: 386,
    limit: 107,
  },
  Unova: {
    offset: 493,
    limit: 156,
  },
  Kalos: {
    offset: 649,
    limit: 72,
  },
  Alola: {
    offset: 721,
    limit: 88,
  },
  Galar: {
    offset: 809,
    limit: 96,
  },
  Paldea: {
    offset: 905,
    limit: 120,
  },
}

const FAVORITES_KEY = 'favorites'

// Interfaces para DTOs
export interface PokemonSimplifiedDTO {
  name: string
  url: string
}

export interface PokemonDTO {
  id: number
  name: string
  height: number
  weight: number
  types: Array<{
    slot: number
    type: {
      name: string
    }
  }>
  sprites: {
    other: {
      'official-artwork': {
        front_default: string
      }
      dream_world: {
        front_default: string
      }
    }
  }
  stats: Array<{
    base_stat: number
    stat: {
      name:
        | 'hp'
        | 'attack'
        | 'defense'
        | 'special-attack'
        | 'special-defense'
        | 'speed'
    }
  }>
}

export const usePokemons = (generation: PokemonGeneration) => {
  const [pokemons, setPokemons] = useState<Pokemon[] | undefined>(undefined)
  const [hasError, setHasError] = useState(false)

  const getFavoriteIDs = (): string[] => {
    try {
      const favorites = localStorage.getItem(FAVORITES_KEY)
      return favorites ? JSON.parse(favorites) : []
    } catch {
      return []
    }
  }

  const loadPokemonsByGeneration = async (generation: PokemonGeneration) => {
    try {
      setHasError(false)
      setPokemons(undefined)

      const { limit, offset } = pokemonGenerations[generation]

      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      )

      if (!response.ok) {
        throw new Error('Error fetching pokemon list')
      }

      const data = await response.json()
      const results: PokemonSimplifiedDTO[] = data.results

      const pokemonsDTO = await Promise.all(
        results.map(async ({ url }) => {
          const pokemonResponse = await fetch(url)
          if (!pokemonResponse.ok) {
            throw new Error(`Error fetching pokemon from ${url}`)
          }
          return pokemonResponse.json()
        })
      )

      const favoritePokemonIDs = getFavoriteIDs()

      const pokemonsData = pokemonsDTO.map((pokemonDTO: PokemonDTO) =>
        buildPokemon(pokemonDTO, favoritePokemonIDs)
      )

      setPokemons(pokemonsData)
    } catch (error) {
      setHasError(true)
    }
  }

  useEffect(() => {
    loadPokemonsByGeneration(generation)
  }, [generation])

  const updatePokemon = (updatedPokemon: Pokemon) => {
    const updatedPokemons = pokemons?.map((p) =>
      p.id === updatedPokemon.id ? updatedPokemon : p
    )
    setPokemons(updatedPokemons)
  }

  return {
    pokemons,
    hasError,
    updatePokemon,
  }
}
