import { FC } from 'react'
import { PokemonType } from '@/core/Pokemon/domain/PokemonType'
import styles from './TypeIcon.module.css'

interface TypeIconProps {
  type: PokemonType
}

const TYPE_COLORS: Record<PokemonType, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
}

const TYPE_ICONS: Record<PokemonType, string> = {
  normal: '⚪',
  fire: '🔥',
  water: '💧',
  electric: '⚡',
  grass: '🌿',
  ice: '❄️',
  fighting: '👊',
  poison: '☠️',
  ground: '🌍',
  flying: '🪶',
  psychic: '🔮',
  bug: '🐛',
  rock: '🪨',
  ghost: '👻',
  dragon: '🐉',
  dark: '🌙',
  steel: '⚙️',
  fairy: '🧚',
}

export const TypeIcon: FC<TypeIconProps> = ({ type }) => {
  return (
    <div
      className={styles.typeIcon}
      style={{ backgroundColor: TYPE_COLORS[type] }}
      title={type.charAt(0).toUpperCase() + type.slice(1)}
    >
      <span className={styles.icon}>{TYPE_ICONS[type]}</span>
    </div>
  )
}
