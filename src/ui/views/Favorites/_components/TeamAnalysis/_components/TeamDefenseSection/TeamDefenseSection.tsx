import { FC } from 'react'
import { TeamDefenseAnalysis } from '@/core/Team/domain/Team'
import { TypeIcon } from '../TypeIcon'
import { DefenseBar } from '../DefenseBar'
import styles from './TeamDefenseSection.module.css'

interface TeamDefenseSectionProps {
  defense: TeamDefenseAnalysis[]
}

export const TeamDefenseSection: FC<TeamDefenseSectionProps> = ({
  defense,
}) => {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Team Defense</h3>
      <div className={styles.grid}>
        {defense.map((typeDefense) => (
          <div key={typeDefense.type} className={styles.typeRow}>
            <TypeIcon type={typeDefense.type} />
            <DefenseBar weaknesses={typeDefense.teamWeakness} />
          </div>
        ))}
      </div>
    </section>
  )
}
