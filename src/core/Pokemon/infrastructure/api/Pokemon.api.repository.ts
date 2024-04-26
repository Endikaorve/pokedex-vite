import { apiClient } from '@/core/_clients/apiClient'

import { PokemonGeneration } from '../../domain/Pokemon'
import { PokemonRepository } from '../../domain/PokemonRepository'
import { PokemonDTO, PokemonSimplifiedDTO } from './dto/Pokemon.dto'
import { mapPokemonDTOToPokemon } from './mappers/mapPokemonDTOToPokemon'
import { localStorageClient } from '@/core/_clients/localStorageClient'

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

export const pokemonApiRepository: PokemonRepository = {
  listByGeneration: async (generation) => {
    const { limit, offset } = pokemonGenerations[generation]

    const { results } = await apiClient.get<{
      results: PokemonSimplifiedDTO[]
    }>(`https://pokeapi.co/api/v2/pokemon`, {
      params: {
        offset,
        limit,
      },
    })

    const pokemonsDTO = await Promise.all(
      results.map(({ url }) => apiClient.get<PokemonDTO>(url))
    )

    const favoritePokemonIDs = listIDs()

    return pokemonsDTO.map((pokemonDTO) =>
      mapPokemonDTOToPokemon(pokemonDTO, favoritePokemonIDs)
    )
  },
  getById: async (id) => {
    const pokemonDTO = await apiClient.get<PokemonDTO>(
      `https://pokeapi.co/api/v2/pokemon/${id}`
    )

    const favoritePokemonIDs = listIDs()

    return mapPokemonDTOToPokemon(pokemonDTO, favoritePokemonIDs)
  },
  toggleFavorite: ({ id }) => {
    const favorites = listIDs()

    const isAlreadyFavorite = favorites.includes(id)

    if (isAlreadyFavorite) {
      removeFavorite(id, favorites)

      return
    }

    addFavorite(id, favorites)
  },
  listFavorites: async () => {
    const favoritePokemonIDs = listIDs()

    const favoritePokemons = await Promise.all(
      favoritePokemonIDs.map((id) =>
        apiClient.get<PokemonDTO>(`https://pokeapi.co/api/v2/pokemon/${id}`)
      )
    )

    return favoritePokemons.map((pokemonDTO) =>
      mapPokemonDTOToPokemon(pokemonDTO, favoritePokemonIDs)
    )
  },
}

const listIDs = () => {
  return localStorageClient.get<string[]>(FAVORITES_KEY) ?? []
}

const addFavorite = (id: string, favorites: string[]) => {
  localStorageClient.set(FAVORITES_KEY, [...favorites, id])
}

const removeFavorite = (id: string, favorites: string[]) => {
  localStorageClient.set(
    FAVORITES_KEY,
    favorites.filter((favorite: string) => favorite !== id)
  )
}
