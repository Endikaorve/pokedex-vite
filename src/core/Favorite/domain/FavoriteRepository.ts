export interface FavoriteRepository {
  getFavoritePokemonIDs: () => string[]
  toggleFavoritePokemon: (id: string) => void
}
