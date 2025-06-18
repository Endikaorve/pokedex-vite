import { useState, useEffect } from 'react'

import { Pokemon, PokemonGeneration } from '@/core/Pokemon/domain/Pokemon'
import { PokemonType } from '@/core/Pokemon/domain/PokemonType'

// Configuración de generaciones
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
interface PokemonSimplifiedDTO {
  name: string
  url: string
}

interface PokemonDTO {
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

  // Funciones utilitarias
  const getFavoriteIDs = (): string[] => {
    try {
      const favorites = localStorage.getItem(FAVORITES_KEY)
      return favorites ? JSON.parse(favorites) : []
    } catch {
      return []
    }
  }

  const buildPokemon = (
    pokemonDTO: PokemonDTO,
    favoritePokemonIDs: string[]
  ): Pokemon => {
    const mapStatsDTOToStats = (
      stats: PokemonDTO['stats']
    ): Pokemon['stats'] => {
      const statsMap = stats.reduce((acc, { base_stat, stat }) => {
        const statNameMapper: Record<
          PokemonDTO['stats'][0]['stat']['name'],
          keyof Pokemon['stats']
        > = {
          hp: 'hp',
          attack: 'attack',
          defense: 'defense',
          'special-attack': 'specialAttack',
          'special-defense': 'specialDefense',
          speed: 'speed',
        }

        const statName = statNameMapper[stat.name]

        return {
          ...acc,
          [statName]: base_stat,
        }
      }, {} as Pokemon['stats'])

      return statsMap
    }

    return {
      id: pokemonDTO.id.toString(),
      name: pokemonDTO.name,
      height: pokemonDTO.height / 10,
      weight: pokemonDTO.weight / 10,
      types: pokemonDTO.types.map(
        ({ type }) =>
          (type.name === 'psychic' ? 'psichyc' : type.name) as PokemonType
      ),
      images: {
        main: pokemonDTO.sprites.other['official-artwork'].front_default,
        alt: pokemonDTO.sprites.other.dream_world.front_default,
      },
      stats: mapStatsDTOToStats(pokemonDTO.stats),
      isFavorite: favoritePokemonIDs.includes(pokemonDTO.id.toString()),
    }
  }

  // Función para cargar pokémons por generación
  const loadPokemonsByGeneration = async (generation: PokemonGeneration) => {
    try {
      setHasError(false)
      setPokemons(undefined)

      const { limit, offset } = pokemonGenerations[generation]

      // Fetch de la lista de pokémons
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      )

      if (!response.ok) {
        throw new Error('Error fetching pokemon list')
      }

      const data = await response.json()
      const results: PokemonSimplifiedDTO[] = data.results

      // Fetch individual de cada pokémon
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

  // Effect para cargar pokémons cuando cambia la generación
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
