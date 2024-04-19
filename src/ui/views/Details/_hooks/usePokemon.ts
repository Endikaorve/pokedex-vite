import { Pokemon } from "@/core/Pokemon/domain/Pokemon";
import { pokemonServiceContainer } from "@/core/Pokemon/services/_di";
import { useQueryService } from "@/ui/hooks/useQueryService";

export const usePokemon = (id: Pokemon["id"]) => {
  const { data, hasError, mutate } = useQueryService(
    "pokemon.getById",
    [],
    () => pokemonServiceContainer("getById")(id)
  );

  return { pokemon: data, hasError, mutate };
};
