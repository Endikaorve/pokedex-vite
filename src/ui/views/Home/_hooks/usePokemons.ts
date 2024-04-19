import { PokemonGeneration } from "@/core/Pokemon/domain/Pokemon";
import { pokemonService } from "@/core/Pokemon/services/Pokemon.service";
import { useQueryService } from "@/ui/hooks/useQueryService";

export const usePokemons = (generation: PokemonGeneration) => {
  const { data, hasError, mutate } = useQueryService(
    "pokemon.listByGeneration",
    [generation],
    () => pokemonService.listByGeneration(generation)
  );

  return { pokemons: data, hasError, mutate };
};
