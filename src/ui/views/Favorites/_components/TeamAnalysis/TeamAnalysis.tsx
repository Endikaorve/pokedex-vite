import { FC, useMemo } from 'react'
import { Team } from '@/core/Team/domain/Team'
import { teamService } from '@/core/Team/services/Team.service'
import { TeamDefenseSection } from './TeamDefenseSection'
import { TeamCoverageSection } from './TeamCoverageSection'
import styles from './TeamAnalysis.module.css'

interface TeamAnalysisProps {
  team: Team
}

export const TeamAnalysis: FC<TeamAnalysisProps> = ({ team }) => {
  const analysis = useMemo(() => {
    try {
      return teamService.analyze(team)
    } catch (error) {
      console.error('Error analyzing team:', error)
      return null
    }
  }, [team])

  if (!analysis) {
    return (
      <div className={styles.container}>
        <p>Error al analizar el equipo</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <TeamDefenseSection defense={analysis.defense} />
      <TeamCoverageSection coverage={analysis.offense} />
    </div>
  )
}
