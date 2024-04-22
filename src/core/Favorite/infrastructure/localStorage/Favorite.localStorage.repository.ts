import { localStorageClient } from '@/core/_clients/localStorageClient'
import { StorageRepository } from '../../domain/FavoriteRepository'

const FAVORITES_KEY = 'favorites'

export const localStorageRepository: StorageRepository = {
  toggleFavoritePokemon: (id) => {
    const favorites = getFavoritePokemonIDs()

    const isAlreadyFavorite = favorites.includes(id)

    if (isAlreadyFavorite) {
      removeFavorite(id, favorites)

      return
    }

    addFavorite(id, favorites)
  },
  getFavoritePokemonIDs: () => {
    return getFavoritePokemonIDs()
  },
}

const getFavoritePokemonIDs = () => {
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
