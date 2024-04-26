export type PokemonType =
  | 'bug'
  | 'dark'
  | 'dragon'
  | 'electric'
  | 'fairy'
  | 'fighting'
  | 'fire'
  | 'flying'
  | 'ghost'
  | 'grass'
  | 'ground'
  | 'ice'
  | 'normal'
  | 'poison'
  | 'psychic'
  | 'rock'
  | 'steel'
  | 'water'

export interface Pokemon {
  id: string
  name: string
  height: number
  weight: number
  types: PokemonType[]
  images: {
    main: string
    alt: string
  }
  stats: {
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
  isFavorite: boolean
}

export const POKEMON_GENERATIONS = [
  'Kanto',
  'Johto',
  'Hoenn',
  'Sinnoh',
  'Unova',
  'Kalos',
  'Alola',
  'Galar',
  'Paldea',
] as const

export type PokemonGeneration = (typeof POKEMON_GENERATIONS)[number]
