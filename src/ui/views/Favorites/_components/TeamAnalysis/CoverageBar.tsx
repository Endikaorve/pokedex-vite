import { FC } from 'react'
import styles from './CoverageBar.module.css'

interface CoverageBarProps {
  coverage: number
  maxTeamSize?: number
}

export const CoverageBar: FC<CoverageBarProps> = ({
  coverage,
  maxTeamSize = 6,
}) => {
  return (
    <div className={styles.barContainer}>
      {Array.from({ length: maxTeamSize }, (_, index) => (
        <div
          key={index}
          className={`${styles.bar} ${
            index < coverage ? styles.active : styles.inactive
          }`}
          title={`${coverage} Pokémon with coverage`}
        />
      ))}
    </div>
  )
}
