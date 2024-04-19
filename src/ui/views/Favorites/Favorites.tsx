import { FC } from "react";
import { useFavorites } from "./_hooks/useFavorites";
import classes from "./Favorites.module.css";
import { PokemonList } from "../Home/_components/PokemonList";
import { pokemonServiceContainer } from "@/core/Pokemon/services/_di";
import { Pokemon } from "@/core/Pokemon/domain/Pokemon";

export const Favorites: FC = () => {
  const { pokemons, hasError, mutate } = useFavorites();

  const handleFavoriteToggle = (pokemon: Pokemon) => {
    const updatedPokemon = pokemonServiceContainer("toggleFavorite")(pokemon);

    const updatedPokemons = pokemons?.map((pokemon) =>
      pokemon.id === updatedPokemon.id ? updatedPokemon : pokemon
    );

    mutate(updatedPokemons);
  };

  if (hasError) {
    return (
      <main>
        <h1>Error al cargar los Pokémons Favoritos</h1>
      </main>
    );
  }

  return (
    <main>
      <main className={classes.container}>
        <PokemonList
          pokemons={pokemons}
          onFavoriteToggle={handleFavoriteToggle}
        />
      </main>
    </main>
  );
};
