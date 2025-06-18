import { FC } from 'react'

import { Pokemon } from '@/core/Pokemon/domain/Pokemon'

import { PokemonCard } from './_components/PokemonCard'
import { PokemonCardSkeleton } from './_components/PokemonCardSkeleton'
import styles from './PokemonList.module.css'

interface Props {
  pokemons: Pokemon[] | undefined
  onFavoriteToggle: (pokemon: Pokemon) => void
}

export const PokemonList: FC<Props> = ({ pokemons, onFavoriteToggle }) => {
  const isLoading = pokemons === undefined

  if (isLoading) {
    return (
      <section className={styles.container}>
        {Array.from(Array(9).keys()).map((index) => (
          <PokemonCardSkeleton key={index} />
        ))}
      </section>
    )
  }

  if (pokemons.length === 0) {
    return (
      <section className={styles.container}>
        <h2>No Pokémons found</h2>
      </section>
    )
  }

  return (
    <section className={styles.container}>
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </section>
  )
}
