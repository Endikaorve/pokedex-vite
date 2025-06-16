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

/**
 * Convierte un multiplicador de efectividad a nivel de debilidad
 */
const getWeaknessLevel = (multiplier: TypeMultiplier): WeaknessLevel => {
  if (multiplier === 0) return 'immune'
  if (multiplier === 0.25) return 'very-resistant'
  if (multiplier === 0.5) return 'resistant'
  if (multiplier === 1) return 'neutral'
  if (multiplier === 2) return 'weak'
  if (multiplier === 4) return 'very-weak'

  // Fallback para casos no esperados
  return 'neutral'
}

/**
 * Calcula la efectividad de un tipo atacante contra un Pokémon (considerando tipos duales)
 */
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

/**
 * Calcula el análisis defensivo del equipo
 */
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

/**
 * Calcula el análisis ofensivo del equipo
 */
const calculateTeamCoverage = (team: Team): TeamCoverageAnalysis[] => {
  // Obtener todos los tipos únicos del equipo
  const teamTypes = new Set<PokemonType>()
  team.forEach((pokemon) => {
    pokemon.types.forEach((type) => teamTypes.add(type))
  })

  const uniqueTeamTypes = Array.from(teamTypes)
  const totalTeamTypes = uniqueTeamTypes.length

  return POKEMON_TYPES.map((defendingType) => {
    // Contar cuántos tipos del equipo son súper efectivos contra este tipo
    const superEffectiveTypes = uniqueTeamTypes.filter((attackingType) => {
      const effectiveness = getTypeEffectiveness(attackingType, defendingType)
      return effectiveness > 1 // Súper efectivo
    })

    // Calcular cobertura como porcentaje
    const coverage =
      totalTeamTypes > 0
        ? (superEffectiveTypes.length / totalTeamTypes) * 100
        : 0

    return {
      type: defendingType,
      coverage: Math.round(coverage * 100) / 100, // Redondear a 2 decimales
    }
  })
}

/**
 * Valida que el equipo tenga un tamaño válido
 */
const validateTeamSize = (team: Team): void => {
  if (team.length === 0) {
    throw new Error('Team must have at least 1 Pokémon')
  }

  if (team.length > 6) {
    throw new Error('Team cannot have more than 6 Pokémon')
  }
}

/**
 * Analiza un equipo Pokémon y retorna análisis defensivo y ofensivo
 */
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
