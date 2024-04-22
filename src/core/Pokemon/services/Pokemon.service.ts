import {
  Pokemon,
  PokemonGeneration,
  PokemonSimplified,
} from '../domain/Pokemon'

import { pokemonApiRepository } from '../infrastructure/api/Pokemon.api.repository'
import { localStorageRepository } from '@/core/Storage/infrastructure/localStorage/Storage.localStorage.repository'

export const pokemonService = {
  listByGeneration: async (
    generation: PokemonGeneration
  ): Promise<Pokemon[]> => {
    const pokemons = await pokemonApiRepository.listByGeneration(generation)
    const favoritePokemonIDs = localStorageRepository.getFavoritePokemonIDs()

    return pokemons.map((pokemon) =>
      buildPokemonFromSimplified(pokemon, { favoritePokemonIDs })
    )
  },
  getById: async (id: Pokemon['id']): Promise<Pokemon> => {
    const pokemon = await pokemonApiRepository.getById(id)
    const favoritePokemonIDs = localStorageRepository.getFavoritePokemonIDs()

    return buildPokemonFromSimplified(pokemon, { favoritePokemonIDs })
  },
  toggleFavorite: (pokemon: Pokemon): Pokemon => {
    localStorageRepository.toggleFavoritePokemon(pokemon.id)

    return { ...pokemon, isFavorite: !pokemon.isFavorite }
  },
  listFavorites: async (): Promise<Pokemon[]> => {
    const favoritePokemonIDs = localStorageRepository.getFavoritePokemonIDs()

    const favoritePokemons = await Promise.all(
      favoritePokemonIDs.map((id) => pokemonApiRepository.getById(id))
    )

    return favoritePokemons.map((pokemon) =>
      buildPokemonFromSimplified(pokemon, { favoritePokemonIDs })
    )
  },
}

const buildPokemonFromSimplified = (
  pokemon: PokemonSimplified,
  { favoritePokemonIDs }: { favoritePokemonIDs: string[] }
): Pokemon => ({
  ...pokemon,
  isFavorite: favoritePokemonIDs.includes(pokemon.id),
})
