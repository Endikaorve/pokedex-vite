export type PokemonType =
  | 'rock'
  | 'ghost'
  | 'steel'
  | 'water'
  | 'grass'
  | 'psychic'
  | 'ice'
  | 'dark'
  | 'fairy'
  | 'normal'
  | 'fighting'
  | 'flying'
  | 'poison'
  | 'ground'
  | 'bug'
  | 'fire'
  | 'electric'
  | 'dragon'
  | 'rock'
  | 'ghost'
  | 'steel'
  | 'water'
  | 'grass'
  | 'psychic'
  | 'ice'
  | 'dark'
  | 'fairy'
  | 'normal'
  | 'fighting'
  | 'flying'
  | 'poison'
  | 'ground'
  | 'bug'
  | 'fire'
  | 'electric'
  | 'dragon'

export interface PokemonSimplified {
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
}

export interface Pokemon extends PokemonSimplified {
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
