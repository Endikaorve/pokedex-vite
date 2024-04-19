import { describe, expect, it, vitest } from "vitest";
import { pokemonService } from "../Pokemon.service";
import { PokemonRepository } from "../../domain/PokemonRepository";
import { StorageRepository } from "@/core/Shared/Storage/domain/StorageRepository";
import { Pokemon, PokemonSimplified } from "../../domain/Pokemon";

const simplifiedPokemons: PokemonSimplified[] = [
  {
    id: "1",
    name: "bulbasaur",
    height: 0.7,
    weight: 6.9,
    types: ["grass", "poison"],
    images: {
      main: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
      alt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg",
    },
    stats: {
      hp: 45,
      attack: 49,
      defense: 49,
      specialAttack: 65,
      specialDefense: 65,
      speed: 45,
    },
  },
  {
    id: "2",
    name: "ivysaur",
    height: 1,
    weight: 13,
    types: ["grass", "poison"],
    images: {
      main: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
      alt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/2.svg",
    },
    stats: {
      hp: 60,
      attack: 62,
      defense: 63,
      specialAttack: 80,
      specialDefense: 80,
      speed: 60,
    },
  },
];

const favoritePokemonIDs = ["2"];

describe("PokemonService", () => {
  describe("listByGeneration", async () => {
    it("should return a list of pokemons by generation", async () => {
      const pokemonRepository: PokemonRepository = {
        listByGeneration: vitest.fn().mockResolvedValue(simplifiedPokemons),
        getById: vitest.fn(),
      };

      const storageRepository: StorageRepository = {
        getFavoritePokemonIDs: vitest.fn().mockReturnValue(favoritePokemonIDs),
        toggleFavoritePokemon: vitest.fn(),
      };

      const result = await pokemonService({
        pokemonRepository,
        storageRepository,
      }).listByGeneration("Kanto");

      const expected: Pokemon[] = [
        {
          id: "1",
          name: "bulbasaur",
          height: 0.7,
          weight: 6.9,
          types: ["grass", "poison"],
          images: {
            main: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
            alt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg",
          },
          stats: {
            hp: 45,
            attack: 49,
            defense: 49,
            specialAttack: 65,
            specialDefense: 65,
            speed: 45,
          },
          isFavorite: false,
        },
        {
          id: "2",
          name: "ivysaur",
          height: 1,
          weight: 13,
          types: ["grass", "poison"],
          images: {
            main: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
            alt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/2.svg",
          },
          stats: {
            hp: 60,
            attack: 62,
            defense: 63,
            specialAttack: 80,
            specialDefense: 80,
            speed: 60,
          },
          isFavorite: true,
        },
      ];

      expect(result).toStrictEqual(expected);
    });
  });

  describe("getById", async () => {
    it("should return a pokemon by id", async () => {
      const pokemonRepository: PokemonRepository = {
        listByGeneration: vitest.fn(),
        getById: vitest.fn().mockResolvedValue(simplifiedPokemons[0]),
      };

      const storageRepository: StorageRepository = {
        getFavoritePokemonIDs: vitest.fn().mockReturnValue(favoritePokemonIDs),
        toggleFavoritePokemon: vitest.fn(),
      };

      const result = await pokemonService({
        pokemonRepository,
        storageRepository,
      }).getById("1");

      const expected: Pokemon = {
        id: "1",
        name: "bulbasaur",
        height: 0.7,
        weight: 6.9,
        types: ["grass", "poison"],
        images: {
          main: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
          alt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg",
        },
        stats: {
          hp: 45,
          attack: 49,
          defense: 49,
          specialAttack: 65,
          specialDefense: 65,
          speed: 45,
        },
        isFavorite: false,
      };

      expect(result).toStrictEqual(expected);
    });
  });

  describe("toggleFavorite", async () => {
    it("should toggle a pokemon as favorite", async () => {
      const pokemonRepository: PokemonRepository = {
        listByGeneration: vitest.fn(),
        getById: vitest.fn(),
      };

      const storageRepository: StorageRepository = {
        getFavoritePokemonIDs: vitest.fn(),
        toggleFavoritePokemon: vitest.fn(),
      };

      const pokemon: Pokemon = {
        id: "1",
        name: "bulbasaur",
        height: 0.7,
        weight: 6.9,
        types: ["grass", "poison"],
        images: {
          main: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
          alt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg",
        },
        stats: {
          hp: 45,
          attack: 49,
          defense: 49,
          specialAttack: 65,
          specialDefense: 65,
          speed: 45,
        },
        isFavorite: false,
      };

      const result = pokemonService({
        pokemonRepository,
        storageRepository,
      }).toggleFavorite(pokemon);

      const expected: Pokemon = {
        id: "1",
        name: "bulbasaur",
        height: 0.7,
        weight: 6.9,
        types: ["grass", "poison"],
        images: {
          main: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
          alt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg",
        },
        stats: {
          hp: 45,
          attack: 49,
          defense: 49,
          specialAttack: 65,
          specialDefense: 65,
          speed: 45,
        },
        isFavorite: true,
      };

      expect(storageRepository.toggleFavoritePokemon).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(expected);
    });
  });

  describe("listFavorites", async () => {
    it("should return a list of favorite pokemons", async () => {
      const pokemonRepository: PokemonRepository = {
        listByGeneration: vitest.fn(),
        getById: vitest.fn().mockResolvedValue(simplifiedPokemons[1]),
      };

      const storageRepository: StorageRepository = {
        getFavoritePokemonIDs: vitest.fn().mockReturnValue(favoritePokemonIDs),
        toggleFavoritePokemon: vitest.fn(),
      };

      const result = await pokemonService({
        pokemonRepository,
        storageRepository,
      }).listFavorites();

      const expected: Pokemon[] = [
        {
          id: "2",
          name: "ivysaur",
          height: 1,
          weight: 13,
          types: ["grass", "poison"],
          images: {
            main: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
            alt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/2.svg",
          },
          stats: {
            hp: 60,
            attack: 62,
            defense: 63,
            specialAttack: 80,
            specialDefense: 80,
            speed: 60,
          },
          isFavorite: true,
        },
      ];

      expect(pokemonRepository.getById).toHaveBeenCalledTimes(1);
      expect(pokemonRepository.getById).toHaveBeenCalledWith("2");
      expect(result).toStrictEqual(expected);
    });
  });
});
