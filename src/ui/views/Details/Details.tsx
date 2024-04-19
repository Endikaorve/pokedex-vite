import { FC } from "react";
import { usePokemon } from "./_hooks/usePokemon";
import { PokemonCard } from "../Home/_components/PokemonList/_components/PokemonCard";
import { pokemonServiceContainer } from "@/core/Pokemon/services/_di";
import { useParams } from "@/ui/hooks/router";

export const Details: FC = () => {
  const { id } = useParams();

  if (id === undefined) {
    return (
      <main>
        <h1>El Pokémon no existe</h1>
      </main>
    );
  }

  const { pokemon, hasError, mutate } = usePokemon(id);

  if (hasError) {
    return (
      <main>
        <h1>Error al cargar el Pokémon</h1>
      </main>
    );
  }

  const isLoading = pokemon === undefined;

  if (isLoading) {
    return (
      <main>
        <h1>Cargando...</h1>
      </main>
    );
  }

  const handleFavoriteToggle = () => {
    const updatedPokemon = pokemonServiceContainer("toggleFavorite")(pokemon);

    mutate(updatedPokemon, {
      revalidate: false,
    });
  };

  return (
    <main>
      <PokemonCard pokemon={pokemon} onFavoriteToggle={handleFavoriteToggle} />
    </main>
  );
};
