import { Pokemon } from './Pokemon'

export interface PokemonRepository {
  listFavorites: () => Promise<Pokemon[]>
  toggleFavorite: (pokemon: Pokemon) => void
}
