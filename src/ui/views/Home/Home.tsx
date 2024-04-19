import { FC, useState } from "react";

import { Pokemon, PokemonGeneration } from "@/core/Pokemon/domain/Pokemon";

import { PokemonList } from "./_components/PokemonList";
import { Search } from "./_components/Search";
import classes from "./Home.module.css";
import { usePokemons } from "./_hooks/usePokemons";
import { pokemonServiceContainer } from "@/core/Pokemon/services/_di";

export const Home: FC = () => {
  const [generation, setGeneration] = useState<PokemonGeneration>("Kanto");
  const [search, setSearch] = useState<string>("");
  const { pokemons, hasError, mutate } = usePokemons(generation);

  const handleFavoriteToggle = (pokemon: Pokemon) => {
    const updatedPokemon = pokemonServiceContainer("toggleFavorite")(pokemon);

    const updatedPokemons = pokemons?.map((pokemon) =>
      pokemon.id === updatedPokemon.id ? updatedPokemon : pokemon
    );

    mutate(updatedPokemons, {
      revalidate: false,
    });
  };

  if (hasError) {
    return (
      <main>
        <h1>Error al cargar los Pokémons</h1>
      </main>
    );
  }

  const filteredPokemons = pokemons?.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className={classes.container}>
      <Search
        generation={generation}
        search={search}
        onGenerationChange={setGeneration}
        onSearchChange={setSearch}
      />
      <PokemonList
        pokemons={filteredPokemons}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </main>
  );
};
