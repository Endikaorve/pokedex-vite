import { pokemonService } from "../Pokemon.service";

type PokemonService = keyof typeof pokemonService;

export const pokemonServiceContainer = <T extends PokemonService>(
  serviceName: T
) => {
  const service = pokemonService[serviceName];

  return (...args: Parameters<typeof service>) => {
    return (service as Function)(...args) as ReturnType<typeof service>;
  };
};
