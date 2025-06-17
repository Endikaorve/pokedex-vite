import { apiClient } from '@/core/_clients/apiClient'

import { PokemonRepository } from '../domain/PokemonRepository'
import { PokemonDTO } from './dto/Pokemon.dto'
import { buildPokemon } from './mappers/buildPokemon'
import { localStorageClient } from '@/core/_clients/localStorageClient'

const FAVORITES_KEY = 'favorites'

export const pokemonInfraRepository: PokemonRepository = {
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
      buildPokemon(pokemonDTO, favoritePokemonIDs)
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
