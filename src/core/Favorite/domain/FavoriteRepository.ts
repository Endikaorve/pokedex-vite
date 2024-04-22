export interface FavoriteRepository {
  listIDs: () => string[]
  toggleFavoritePokemon: (id: string) => void
}
