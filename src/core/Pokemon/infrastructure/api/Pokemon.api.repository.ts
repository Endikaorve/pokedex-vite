import { apiClient } from '@/core/_clients/apiClient'

import { PokemonGeneration } from '../../domain/Pokemon'
import { PokemonRepository } from '../../domain/PokemonRepository'
import { PokemonDTO, PokemonSimplifiedDTO } from './dto/Pokemon.dto'
import { mapPokemonDTOToPokemon } from './mappers/mapPokemonDTOToPokemon'

const pokemonGenerations: Record<
  PokemonGeneration,
  {
    offset: number
    limit: number
  }
> = {
  Kanto: {
    offset: 0,
    limit: 151,
  },
  Johto: {
    offset: 151,
    limit: 100,
  },
  Hoenn: {
    offset: 251,
    limit: 135,
  },
  Sinnoh: {
    offset: 386,
    limit: 107,
  },
  Unova: {
    offset: 493,
    limit: 156,
  },
  Kalos: {
    offset: 649,
    limit: 72,
  },
  Alola: {
    offset: 721,
    limit: 88,
  },
  Galar: {
    offset: 809,
    limit: 96,
  },
  Paldea: {
    offset: 905,
    limit: 120,
  },
}

export const pokemonApiRepository: PokemonRepository = {
  listByGeneration: async (generation) => {
    const { limit, offset } = pokemonGenerations[generation]

    const { results } = await apiClient.get<{
      results: PokemonSimplifiedDTO[]
    }>(`https://pokeapi.co/api/v2/pokemon`, {
      params: {
        offset,
        limit,
      },
    })

    const pokemonsDTO = await Promise.all(
      results.map(({ url }) => apiClient.get<PokemonDTO>(url))
    )

    return pokemonsDTO.map(mapPokemonDTOToPokemon)
  },
  getById: async (id) => {
    const pokemonDTO = await apiClient.get<PokemonDTO>(
      `https://pokeapi.co/api/v2/pokemon/${id}`
    )

    return mapPokemonDTOToPokemon(pokemonDTO)
  },
}
