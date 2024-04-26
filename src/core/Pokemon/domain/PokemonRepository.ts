import { Pokemon, PokemonGeneration } from './Pokemon'

export interface PokemonRepository {
  listByGeneration: (generation: PokemonGeneration) => Promise<Pokemon[]>
  getById: (id: Pokemon['id']) => Promise<Pokemon>
  listFavorites: () => Promise<Pokemon[]>
  toggleFavorite: (pokemon: Pokemon) => void
}
