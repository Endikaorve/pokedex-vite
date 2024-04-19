import {
  Pokemon,
  PokemonSimplified,
  PokemonType,
} from '@/core/Pokemon/domain/Pokemon'

import { PokemonDTO } from '../dto/Pokemon.dto'

export const mapPokemonDTOToPokemon = (
  pokemonDTO: PokemonDTO
): PokemonSimplified => ({
  id: pokemonDTO.id.toString(),
  name: pokemonDTO.name,
  height: pokemonDTO.height / 10,
  weight: pokemonDTO.weight / 10,
  types: pokemonDTO.types.map(({ type }) => type.name as PokemonType),
  images: {
    main: pokemonDTO.sprites.other['official-artwork'].front_default,
    alt: pokemonDTO.sprites.other.dream_world.front_default,
  },
  stats: mapStatsDTOToStats(pokemonDTO.stats),
})

const mapStatsDTOToStats = (stats: PokemonDTO['stats']): Pokemon['stats'] => {
  const statsMap = stats.reduce(
    (acc, { base_stat, stat }) => {
      const statNameMapper: Record<
        PokemonDTO['stats'][0]['stat']['name'],
        keyof Pokemon['stats']
      > = {
        hp: 'hp',
        attack: 'attack',
        defense: 'defense',
        'special-attack': 'specialAttack',
        'special-defense': 'specialDefense',
        speed: 'speed',
      }

      const statName = statNameMapper[stat.name]

      return {
        ...acc,
        [statName]: base_stat,
      }
    },
    {} as Pokemon['stats']
  )

  return statsMap
}
