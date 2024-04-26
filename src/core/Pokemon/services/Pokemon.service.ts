import { Pokemon, PokemonGeneration } from '../domain/Pokemon'
import { pokemonInfraRepository } from '../infrastructure/Pokemon.infra.repository'

export const pokemonService = {
  listByGeneration: (generation: PokemonGeneration) => {
    return pokemonInfraRepository.listByGeneration(generation)
  },
  getById: (id: Pokemon['id']) => {
    return pokemonInfraRepository.getById(id)
  },
  toggleFavorite: (pokemon: Pokemon): Pokemon => {
    pokemonInfraRepository.toggleFavorite(pokemon)

    return { ...pokemon, isFavorite: !pokemon.isFavorite }
  },
  listFavorites: () => {
    return pokemonInfraRepository.listFavorites()
  },
}
