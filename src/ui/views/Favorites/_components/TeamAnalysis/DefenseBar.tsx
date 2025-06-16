import { FC } from 'react'
import { WeaknessLevel } from '@/core/Team/domain/Team'
import styles from './DefenseBar.module.css'

interface DefenseBarProps {
  weaknesses: WeaknessLevel[]
}

const WEAKNESS_COLORS: Record<WeaknessLevel, string> = {
  immune: '#9CA3AF',
  'very-resistant': '#60A5FA',
  resistant: '#93C5FD',
  neutral: '#D1D5DB',
  weak: '#FB923C',
  'very-weak': '#EF4444',
}

export const DefenseBar: FC<DefenseBarProps> = ({ weaknesses }) => {
  return (
    <div className={styles.barContainer}>
      {weaknesses.map((weakness, index) => (
        <div
          key={index}
          className={styles.bar}
          style={{ backgroundColor: WEAKNESS_COLORS[weakness] }}
          title={weakness.replace('-', ' ')}
        />
      ))}
    </div>
  )
}
