import { PokemonGeneration } from "@/core/Pokemon/domain/Pokemon";
import { pokemonServiceContainer } from "@/core/Pokemon/services/_di";
import { useQueryService } from "@/ui/hooks/useQueryService";

export const usePokemons = (generation: PokemonGeneration) => {
  const { data, hasError, mutate } = useQueryService(
    "pokemon.listByGeneration",
    [generation],
    () => pokemonServiceContainer("listByGeneration")(generation)
  );

  return { pokemons: data, hasError, mutate };
};
