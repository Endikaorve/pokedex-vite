import { describe, expect, it, vitest } from 'vitest'
import { localStorageRepository } from '../Favorite.localStorage.repository'
import { localStorageClient } from '@/core/_clients/localStorageClient'

describe('Storage.localStorage.repository', () => {
  describe('toggleFavoritePokemon', () => {
    it('add favorite Pokemon', async () => {
      vitest.spyOn(localStorageClient, 'get').mockReturnValue(['2', '3'])
      vitest.spyOn(localStorageClient, 'set').mockImplementation(vitest.fn())

      localStorageRepository.toggleFavoritePokemon('1')

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

      localStorageRepository.toggleFavoritePokemon('1')

      expect(localStorageClient.get).toHaveBeenCalledTimes(1)
      expect(localStorageClient.get).toHaveBeenCalledWith('favorites')
      expect(localStorageClient.set).toHaveBeenCalledTimes(1)
      expect(localStorageClient.set).toHaveBeenCalledWith('favorites', [
        '2',
        '3',
      ])
    })
  })

  describe('getFavoritePokemonIDs', () => {
    it('return favorite Pokemon IDs', async () => {
      vitest.spyOn(localStorageClient, 'get').mockReturnValue(['1', '2', '3'])

      const result = localStorageRepository.getFavoritePokemonIDs()

      expect(localStorageClient.get).toHaveBeenCalledTimes(1)
      expect(localStorageClient.get).toHaveBeenCalledWith('favorites')
      expect(result).toEqual(['1', '2', '3'])
    })

    it('return empty array when there are no favorite Pokemon', async () => {
      vitest.spyOn(localStorageClient, 'get').mockReturnValue(undefined)

      const result = localStorageRepository.getFavoritePokemonIDs()

      expect(localStorageClient.get).toHaveBeenCalledTimes(1)
      expect(localStorageClient.get).toHaveBeenCalledWith('favorites')
      expect(result).toEqual([])
    })
  })
})
