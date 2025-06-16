import { PokemonType } from '@/core/Pokemon/domain/PokemonType'
import { Pokemon } from '@/core/Pokemon/domain/Pokemon'

export type WeaknessLevel =
  | 'immune'
  | 'very-resistant'
  | 'resistant'
  | 'neutral'
  | 'weak'
  | 'very-weak'

export interface TeamDefenseAnalysis {
  type: PokemonType
  teamWeakness: WeaknessLevel[]
}

export interface TeamCoverageAnalysis {
  type: PokemonType
  coverage: number
}

export interface TeamAnalysis {
  defense: TeamDefenseAnalysis[]
  offense: TeamCoverageAnalysis[]
}

export type Team = Pokemon[]
