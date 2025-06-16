import { FC } from 'react'

import {
  POKEMON_GENERATIONS,
  PokemonGeneration,
} from '@/core/Pokemon/domain/Pokemon'

import styles from './Search.module.css'

export type StatName =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'specialAttack'
  | 'specialDefense'
  | 'speed'
export type StatComparison = 'greater' | 'equal' | 'less'

export interface StatFilter {
  stat: StatName
  comparison: StatComparison
  value: number
}

interface Props {
  generation: string
  onGenerationChange: (generation: PokemonGeneration) => void
  search: string
  onSearchChange: (search: string) => void
  statFilter: StatFilter
  onStatFilterChange: (statFilter: StatFilter) => void
}

const STAT_LABELS: Record<StatName, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  specialAttack: 'S.ATK',
  specialDefense: 'S.DEF',
  speed: 'SPD',
}

const COMPARISON_LABELS: Record<StatComparison, string> = {
  greater: 'Mayor que',
  equal: 'Igual a',
  less: 'Menor que',
}

export const Search: FC<Props> = ({
  generation,
  onGenerationChange,
  search,
  onSearchChange,
  statFilter,
  onStatFilterChange,
}) => {
  return (
    <section className={styles.container}>
      <select
        className={styles.select}
        value={generation}
        onChange={({ target }) => {
          onGenerationChange(target.value as PokemonGeneration)
        }}
      >
        {POKEMON_GENERATIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <input
        className={styles.input}
        value={search}
        placeholder="Filter by name, type..."
        onChange={({ target }) => {
          onSearchChange(target.value)
        }}
      />
      <div className={styles.statFilter}>
        <select
          className={styles.statSelect}
          value={statFilter.stat}
          onChange={({ target }) => {
            onStatFilterChange({
              ...statFilter,
              stat: target.value as StatName,
            })
          }}
        >
          {Object.entries(STAT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          className={styles.comparisonSelect}
          value={statFilter.comparison}
          onChange={({ target }) => {
            onStatFilterChange({
              ...statFilter,
              comparison: target.value as StatComparison,
            })
          }}
        >
          {Object.entries(COMPARISON_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <input
          className={styles.valueInput}
          type="number"
          min="0"
          max="255"
          value={statFilter.value}
          placeholder="Valor"
          onChange={({ target }) => {
            onStatFilterChange({
              ...statFilter,
              value: parseInt(target.value) || 0,
            })
          }}
        />
      </div>
    </section>
  )
}
