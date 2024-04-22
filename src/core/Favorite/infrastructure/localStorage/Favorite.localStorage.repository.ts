import { localStorageClient } from '@/core/_clients/localStorageClient'
import { FavoriteRepository } from '../../domain/FavoriteRepository'

const FAVORITES_KEY = 'favorites'

export const favoriteLocalStorageRepository: FavoriteRepository = {
  toggle: (id) => {
    const favorites = listIDs()

    const isAlreadyFavorite = favorites.includes(id)

    if (isAlreadyFavorite) {
      removeFavorite(id, favorites)

      return
    }

    addFavorite(id, favorites)
  },
  listIDs: () => {
    return listIDs()
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
