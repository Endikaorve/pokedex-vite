export interface FavoriteRepository {
  listIDs: () => string[]
  toggle: (id: string) => void
}
