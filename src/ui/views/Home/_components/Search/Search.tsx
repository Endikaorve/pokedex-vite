import { FC } from 'react'

import {
  POKEMON_GENERATIONS,
  PokemonGeneration,
} from '@/core/Pokemon/domain/Pokemon'

import styles from './Search.module.css'

interface Props {
  generation: string
  onGenerationChange: (generation: PokemonGeneration) => void
  search: string
  onSearchChange: (search: string) => void
}

export const Search: FC<Props> = ({
  generation,
  onGenerationChange,
  search,
  onSearchChange,
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
    </section>
  )
}
