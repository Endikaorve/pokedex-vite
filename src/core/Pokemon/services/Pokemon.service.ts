import { StorageRepository } from "@/core/Shared/Storage/domain/StorageRepository";
import {
  Pokemon,
  PokemonGeneration,
  PokemonSimplified,
} from "../domain/Pokemon";
import { PokemonRepository } from "../domain/PokemonRepository";

export interface PokemonServiceDependencies {
  pokemonRepository: PokemonRepository;
  storageRepository: StorageRepository;
}

export const pokemonService = ({
  pokemonRepository,
  storageRepository,
}: PokemonServiceDependencies) => ({
  listByGeneration: async (
    generation: PokemonGeneration
  ): Promise<Pokemon[]> => {
    const pokemons = await pokemonRepository.listByGeneration(generation);
    const favoritePokemonIDs = storageRepository.getFavoritePokemonIDs();

    return pokemons.map((pokemon) =>
      buildPokemonFromSimplified(pokemon, { favoritePokemonIDs })
    );
  },
  getById: async (id: Pokemon["id"]): Promise<Pokemon> => {
    const pokemon = await pokemonRepository.getById(id);
    const favoritePokemonIDs = storageRepository.getFavoritePokemonIDs();

    return buildPokemonFromSimplified(pokemon, { favoritePokemonIDs });
  },
  toggleFavorite: (pokemon: Pokemon): Pokemon => {
    storageRepository.toggleFavoritePokemon(pokemon.id);

    return { ...pokemon, isFavorite: !pokemon.isFavorite };
  },
  listFavorites: async (): Promise<Pokemon[]> => {
    const favoritePokemonIDs = storageRepository.getFavoritePokemonIDs();

    const favoritePokemons = await Promise.all(
      favoritePokemonIDs.map((id) => pokemonRepository.getById(id))
    );

    return favoritePokemons.map((pokemon) =>
      buildPokemonFromSimplified(pokemon, { favoritePokemonIDs })
    );
  },
});

const buildPokemonFromSimplified = (
  pokemon: PokemonSimplified,
  { favoritePokemonIDs }: { favoritePokemonIDs: string[] }
): Pokemon => ({
  ...pokemon,
  isFavorite: favoritePokemonIDs.includes(pokemon.id),
});
