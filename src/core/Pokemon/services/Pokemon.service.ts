import { Pokemon } from '../domain/Pokemon'
import { PokemonRepository } from '../domain/PokemonRepository'

let pokemonRepository: PokemonRepository

export const pokemonService = {
  toggleFavorite: (pokemon: Pokemon): Pokemon => {
    pokemonRepository.toggleFavorite(pokemon)

    return { ...pokemon, isFavorite: !pokemon.isFavorite }
  },
  listFavorites: () => {
    return pokemonRepository.listFavorites()
  },
}

export const setPokemonRepository = (repository: PokemonRepository) => {
  pokemonRepository = repository
}
