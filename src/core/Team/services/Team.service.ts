import {
  Team,
  TeamAnalysis,
  TeamDefenseAnalysis,
  TeamCoverageAnalysis,
  WeaknessLevel,
} from '../domain/Team'
import {
  PokemonType,
  POKEMON_TYPES,
  getTypeEffectiveness,
  TypeMultiplier,
} from '@/core/Pokemon/domain/PokemonType'

const getWeaknessLevel = (multiplier: TypeMultiplier): WeaknessLevel => {
  if (multiplier === 0) return 'immune'
  if (multiplier === 0.25) return 'very-resistant'
  if (multiplier === 0.5) return 'resistant'
  if (multiplier === 1) return 'neutral'
  if (multiplier === 2) return 'weak'
  if (multiplier === 4) return 'very-weak'

  return 'neutral'
}

const calculatePokemonDefense = (
  attackingType: PokemonType,
  pokemonTypes: PokemonType[]
): TypeMultiplier => {
  let multiplier = 1

  for (const defendingType of pokemonTypes) {
    const effectiveness = getTypeEffectiveness(attackingType, defendingType)
    multiplier *= effectiveness
  }

  return multiplier as TypeMultiplier
}

const calculateTeamDefense = (team: Team): TeamDefenseAnalysis[] => {
  return POKEMON_TYPES.map((attackingType) => {
    const teamWeakness: WeaknessLevel[] = team.map((pokemon) => {
      const multiplier = calculatePokemonDefense(attackingType, pokemon.types)
      return getWeaknessLevel(multiplier)
    })

    return {
      type: attackingType,
      teamWeakness,
    }
  })
}

const calculateTeamCoverage = (team: Team): TeamCoverageAnalysis[] => {
  return POKEMON_TYPES.map((defendingType) => {
    const pokemonWithCoverage = team.filter((pokemon) => {
      return pokemon.types.some((attackingType) => {
        const effectiveness = getTypeEffectiveness(attackingType, defendingType)
        return effectiveness > 1
      })
    })

    return {
      type: defendingType,
      coverage: pokemonWithCoverage.length,
    }
  })
}

const validateTeamSize = (team: Team): void => {
  if (team.length === 0) {
    throw new Error('Team must have at least 1 Pokémon')
  }

  if (team.length > 6) {
    throw new Error('Team cannot have more than 6 Pokémon')
  }
}

const analyze = (team: Team): TeamAnalysis => {
  validateTeamSize(team)

  const defense = calculateTeamDefense(team)
  const offense = calculateTeamCoverage(team)

  return {
    defense,
    offense,
  }
}

export const teamService = {
  analyze,
}
