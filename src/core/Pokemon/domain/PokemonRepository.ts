import { Pokemon, PokemonGeneration } from './Pokemon'

export interface PokemonRepository {
  getById: (id: Pokemon['id']) => Promise<Pokemon>
  listFavorites: () => Promise<Pokemon[]>
  toggleFavorite: (pokemon: Pokemon) => void
}
