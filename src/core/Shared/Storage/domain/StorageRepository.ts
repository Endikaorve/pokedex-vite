export interface StorageRepository {
  getFavoritePokemonIDs: () => string[];
  toggleFavoritePokemon: (id: string) => void;
}
