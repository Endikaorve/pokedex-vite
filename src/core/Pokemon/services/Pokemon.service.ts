import { Pokemon, PokemonGeneration } from '../domain/Pokemon'

import { pokemonApiRepository } from '../infrastructure/api/Pokemon.api.repository'

export const pokemonService = {
  listByGeneration: (generation: PokemonGeneration) => {
    return pokemonApiRepository.listByGeneration(generation)
  },
  getById: (id: Pokemon['id']) => {
    return pokemonApiRepository.getById(id)
  },
  toggleFavorite: (pokemon: Pokemon): Pokemon => {
    pokemonApiRepository.toggleFavorite(pokemon)

    return { ...pokemon, isFavorite: !pokemon.isFavorite }
  },
  listFavorites: () => {
    return pokemonApiRepository.listFavorites()
  },
}
