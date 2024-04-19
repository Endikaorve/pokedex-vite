import { localStorageRepository } from "@/core/Shared/Storage/infrastructure/localStorage/Storage.localStorage.repository";
import { pokemonApiRepository } from "@/core/Pokemon/infrastructure/api/Pokemon.api.repository";
import { PokemonServiceDependencies, pokemonService } from "../Pokemon.service";

type PokemonService = keyof ReturnType<typeof pokemonService>;

const dependenciesByService: Record<
  PokemonService,
  PokemonServiceDependencies
> = {
  listByGeneration: {
    pokemonRepository: pokemonApiRepository,
    storageRepository: localStorageRepository,
  },
  getById: {
    pokemonRepository: pokemonApiRepository,
    storageRepository: localStorageRepository,
  },
  toggleFavorite: {
    pokemonRepository: pokemonApiRepository,
    storageRepository: localStorageRepository,
  },
  listFavorites: {
    pokemonRepository: pokemonApiRepository,
    storageRepository: localStorageRepository,
  },
};

export const pokemonServiceContainer = <T extends PokemonService>(
  serviceName: T
) => {
  const dependencies = dependenciesByService[serviceName];

  const service = pokemonService(dependencies)[serviceName];

  return (...args: Parameters<typeof service>) => {
    return (service as Function)(...args) as ReturnType<typeof service>;
  };
};
