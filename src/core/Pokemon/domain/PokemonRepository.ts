import { Pokemon, PokemonGeneration, PokemonSimplified } from "./Pokemon";

export interface PokemonRepository {
  listByGeneration: (
    generation: PokemonGeneration
  ) => Promise<PokemonSimplified[]>;
  getById: (id: Pokemon["id"]) => Promise<PokemonSimplified>;
}
