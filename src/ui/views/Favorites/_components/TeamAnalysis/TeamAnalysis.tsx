import { FC, useMemo } from 'react'
import { TeamDefenseSection } from './_components/TeamDefenseSection'
import { TeamCoverageSection } from './_components/TeamCoverageSection'
import styles from './TeamAnalysis.module.css'

interface TeamAnalysisProps {
  team: any // ## TODO: Add type
}

export const TeamAnalysis: FC<TeamAnalysisProps> = ({ team }) => {
  const analysis: any = useMemo(() => {
    try {
      return null // ## TODO: Implement team analysis
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
