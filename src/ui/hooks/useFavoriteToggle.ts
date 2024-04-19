import { Pokemon } from "@/core/Pokemon/domain/Pokemon";
import { pokemonServiceContainer } from "@/core/Pokemon/services/_di";

export const useFavoriteToggle = () => {
  const handleFavoriteToggle = (pokemon: Pokemon) => {
    pokemonServiceContainer("toggleFavorite")(pokemon);
  };

  return {
    handleFavoriteToggle,
  };
};
