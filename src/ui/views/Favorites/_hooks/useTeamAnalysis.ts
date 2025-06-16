import { useMemo } from 'react'
import { Pokemon } from '@/core/Pokemon/domain/Pokemon'
import { teamService } from '@/core/Team/services/Team.service'
import { TeamAnalysis } from '@/core/Team/domain/Team'

interface UseTeamAnalysisResult {
  analysis: TeamAnalysis | null
  canAnalyze: boolean
  error: string | null
}

export const useTeamAnalysis = (
  pokemons: Pokemon[] | undefined
): UseTeamAnalysisResult => {
  return useMemo(() => {
    if (!pokemons || pokemons.length === 0) {
      return {
        analysis: null,
        canAnalyze: false,
        error: 'No hay Pokémon en el equipo',
      }
    }

    if (pokemons.length > 6) {
      return {
        analysis: null,
        canAnalyze: false,
        error: 'El equipo no puede tener más de 6 Pokémon',
      }
    }

    try {
      const analysis = teamService.analyze(pokemons)
      return {
        analysis,
        canAnalyze: true,
        error: null,
      }
    } catch (error) {
      return {
        analysis: null,
        canAnalyze: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error al analizar el equipo',
      }
    }
  }, [pokemons])
}
