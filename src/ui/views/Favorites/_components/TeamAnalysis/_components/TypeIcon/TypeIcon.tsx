import { CSSProperties, FC } from 'react'
import { PokemonType } from '@/core/Pokemon/domain/PokemonType'
import { COLORS } from '@/ui/styles/utils/colors'
import styles from './TypeIcon.module.css'

import bug from '@/ui/assets/types/bug.svg'
import dark from '@/ui/assets/types/dark.svg'
import dragon from '@/ui/assets/types/dragon.svg'
import electric from '@/ui/assets/types/electric.svg'
import fairy from '@/ui/assets/types/fairy.svg'
import fighting from '@/ui/assets/types/fighting.svg'
import fire from '@/ui/assets/types/fire.svg'
import flying from '@/ui/assets/types/flying.svg'
import ghost from '@/ui/assets/types/ghost.svg'
import grass from '@/ui/assets/types/grass.svg'
import ground from '@/ui/assets/types/ground.svg'
import ice from '@/ui/assets/types/ice.svg'
import normal from '@/ui/assets/types/normal.svg'
import poison from '@/ui/assets/types/poison.svg'
import psichyc from '@/ui/assets/types/psychic.svg'
import rock from '@/ui/assets/types/rock.svg'
import steel from '@/ui/assets/types/steel.svg'
import water from '@/ui/assets/types/water.svg'

interface TypeIconProps {
  type: PokemonType
}

const TYPE_IMAGES: Record<PokemonType, string> = {
  bug,
  dark,
  dragon,
  electric,
  fairy,
  fighting,
  fire,
  flying,
  ghost,
  grass,
  ground,
  ice,
  normal,
  poison,
  psichyc,
  rock,
  steel,
  water,
}

export const TypeIcon: FC<TypeIconProps> = ({ type }) => {
  const style = {
    '--type-color': COLORS[type],
  } as CSSProperties

  return (
    <div
      className={styles.typeIcon}
      style={style}
      title={type.charAt(0).toUpperCase() + type.slice(1)}
    >
      <img
        src={TYPE_IMAGES[type]}
        alt={`type ${type}`}
        className={styles.icon}
      />
    </div>
  )
}
