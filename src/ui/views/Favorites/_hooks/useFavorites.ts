import { pokemonServiceContainer } from "@/core/Pokemon/services/_di";
import { useQueryService } from "@/ui/hooks/useQueryService";

export const useFavorites = () => {
  const { data, hasError, mutate } = useQueryService(
    "pokemon.listFavorites",
    [],
    () => pokemonServiceContainer("listFavorites")()
  );

  return { pokemons: data, hasError, mutate };
};
