import { FC } from 'react'
import styles from './DefenseBar.module.css'

interface DefenseBarProps {
  weaknesses: any[]
}

const WEAKNESS_COLORS: Record<any, string> = {
  immune: '#1F2937',
  'very-resistant': '#008000',
  resistant: '#17c540',
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
