import { favoriteLocalStorageRepository } from '@/core/Favorite/infrastructure/localStorage/Favorite.localStorage.repository'
import {
  Pokemon,
  PokemonGeneration,
  PokemonSimplified,
} from '../domain/Pokemon'

import { pokemonApiRepository } from '../infrastructure/api/Pokemon.api.repository'

export const pokemonService = {
  listByGeneration: async (
    generation: PokemonGeneration
  ): Promise<Pokemon[]> => {
    const pokemons = await pokemonApiRepository.listByGeneration(generation)
    const favoritePokemonIDs =
      favoriteLocalStorageRepository.getFavoritePokemonIDs()

    return pokemons.map((pokemon) =>
      buildPokemonFromSimplified(pokemon, { favoritePokemonIDs })
    )
  },
  getById: async (id: Pokemon['id']): Promise<Pokemon> => {
    const pokemon = await pokemonApiRepository.getById(id)
    const favoritePokemonIDs =
      favoriteLocalStorageRepository.getFavoritePokemonIDs()

    return buildPokemonFromSimplified(pokemon, { favoritePokemonIDs })
  },
  toggleFavorite: (pokemon: Pokemon): Pokemon => {
    favoriteLocalStorageRepository.toggleFavoritePokemon(pokemon.id)

    return { ...pokemon, isFavorite: !pokemon.isFavorite }
  },
  listFavorites: async (): Promise<Pokemon[]> => {
    const favoritePokemonIDs =
      favoriteLocalStorageRepository.getFavoritePokemonIDs()

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
