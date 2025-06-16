import { FC } from 'react'
import { TeamAnalysis as TeamAnalysisType } from '@/core/Team/domain/Team'
import { TeamDefenseSection } from './TeamDefenseSection'
import { TeamCoverageSection } from './TeamCoverageSection'
import styles from './TeamAnalysis.module.css'

interface TeamAnalysisProps {
  analysis: TeamAnalysisType
}

export const TeamAnalysis: FC<TeamAnalysisProps> = ({ analysis }) => {
  return (
    <div className={styles.container}>
      <TeamDefenseSection defense={analysis.defense} />
      <TeamCoverageSection coverage={analysis.offense} />
    </div>
  )
}
