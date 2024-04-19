import { FC } from "react";

import { Pokemon } from "@/core/Pokemon/domain/Pokemon";

import { PokemonCard } from "./_components/PokemonCard";
import { PokemonCardSkeleton } from "./_components/PokemonCardSkeleton";
import styles from "./PokemonList.module.css";

interface Props {
  pokemons: Pokemon[] | undefined;
  onFavoriteToggle: (pokemon: Pokemon) => void;
}

export const PokemonList: FC<Props> = ({ pokemons, onFavoriteToggle }) => {
  const isLoading = pokemons === undefined;

  return (
    <section className={styles.container}>
      {isLoading
        ? Array.from(Array(10).keys()).map((index) => (
            <PokemonCardSkeleton key={index} />
          ))
        : pokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onFavoriteToggle={onFavoriteToggle}
            />
          ))}
    </section>
  );
};
