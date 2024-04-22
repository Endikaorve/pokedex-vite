import { describe, expect, it, vitest } from 'vitest'
import { favoriteLocalStorageRepository } from '../Favorite.localStorage.repository'
import { localStorageClient } from '@/core/_clients/localStorageClient'

describe('Favorite.localStorage.repository', () => {
  describe('toggleFavoritePokemon', () => {
    it('add favorite Pokemon', async () => {
      vitest.spyOn(localStorageClient, 'get').mockReturnValue(['2', '3'])
      vitest.spyOn(localStorageClient, 'set').mockImplementation(vitest.fn())

      favoriteLocalStorageRepository.toggleFavoritePokemon('1')

      expect(localStorageClient.get).toHaveBeenCalledTimes(1)
      expect(localStorageClient.get).toHaveBeenCalledWith('favorites')
      expect(localStorageClient.set).toHaveBeenCalledTimes(1)
      expect(localStorageClient.set).toHaveBeenCalledWith('favorites', [
        '2',
        '3',
        '1',
      ])
    })

    it('remove favorite Pokemon', async () => {
      vitest.spyOn(localStorageClient, 'get').mockReturnValue(['1', '2', '3'])
      vitest.spyOn(localStorageClient, 'set').mockImplementation(vitest.fn())

      favoriteLocalStorageRepository.toggleFavoritePokemon('1')

      expect(localStorageClient.get).toHaveBeenCalledTimes(1)
      expect(localStorageClient.get).toHaveBeenCalledWith('favorites')
      expect(localStorageClient.set).toHaveBeenCalledTimes(1)
      expect(localStorageClient.set).toHaveBeenCalledWith('favorites', [
        '2',
        '3',
      ])
    })
  })

  describe('listIDs', () => {
    it('return favorite Pokemon IDs', async () => {
      vitest.spyOn(localStorageClient, 'get').mockReturnValue(['1', '2', '3'])

      const result = favoriteLocalStorageRepository.listIDs()

      expect(localStorageClient.get).toHaveBeenCalledTimes(1)
      expect(localStorageClient.get).toHaveBeenCalledWith('favorites')
      expect(result).toEqual(['1', '2', '3'])
    })

    it('return empty array when there are no favorite Pokemon', async () => {
      vitest.spyOn(localStorageClient, 'get').mockReturnValue(undefined)

      const result = favoriteLocalStorageRepository.listIDs()

      expect(localStorageClient.get).toHaveBeenCalledTimes(1)
      expect(localStorageClient.get).toHaveBeenCalledWith('favorites')
      expect(result).toEqual([])
    })
  })
})
