import { Pokemon } from '@/core/Pokemon/domain/Pokemon'
import { PokemonType } from '@/core/Pokemon/domain/PokemonType'

import { PokemonDTO } from '../dto/Pokemon.dto'

export const buildPokemon = (
  pokemonDTO: PokemonDTO,
  favoritePokemonIDs: string[]
): Pokemon => ({
  id: pokemonDTO.id.toString(),
  name: pokemonDTO.name,
  height: pokemonDTO.height / 10,
  weight: pokemonDTO.weight / 10,
  types: pokemonDTO.types.map(
    ({ type }) =>
      (type.name === 'psychic' ? 'psichyc' : type.name) as PokemonType
  ),
  images: {
    main: pokemonDTO.sprites.other['official-artwork'].front_default,
    alt: pokemonDTO.sprites.other.dream_world.front_default,
  },
  stats: mapStatsDTOToStats(pokemonDTO.stats),
  isFavorite: favoritePokemonIDs.includes(pokemonDTO.id.toString()),
})

const mapStatsDTOToStats = (stats: PokemonDTO['stats']): Pokemon['stats'] => {
  const statsMap = stats.reduce((acc, { base_stat, stat }) => {
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
  }, {} as Pokemon['stats'])

  return statsMap
}
