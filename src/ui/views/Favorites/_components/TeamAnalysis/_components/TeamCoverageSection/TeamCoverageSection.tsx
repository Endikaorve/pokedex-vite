import { FC } from 'react'
import { TypeIcon } from '../TypeIcon'
import { CoverageBar } from '../CoverageBar'
import styles from './TeamCoverageSection.module.css'

interface TeamCoverageSectionProps {
  coverage: any[]
  teamSize: number
}

export const TeamCoverageSection: FC<TeamCoverageSectionProps> = ({
  coverage,
  teamSize,
}) => {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Coverage</h3>
      <div className={styles.grid}>
        {coverage.map((typeCoverage) => (
          <div key={typeCoverage.type} className={styles.typeRow}>
            <TypeIcon type={typeCoverage.type} />
            <CoverageBar
              coverage={typeCoverage.coverage}
              maxTeamSize={teamSize}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
