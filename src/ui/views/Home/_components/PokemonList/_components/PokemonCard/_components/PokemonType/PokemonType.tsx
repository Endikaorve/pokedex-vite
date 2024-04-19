import { CSSProperties, FC } from 'react'

import { PokemonType as PokemonTypeModel } from '@/core/Pokemon/domain/Pokemon'
import { COLORS } from '@/ui/styles/utils/colors'
import classes from './PokemonType.module.css'

interface Props {
  type: PokemonTypeModel
}

export const PokemonType: FC<Props> = ({ type }) => {
  const style = {
    '--type-color': COLORS[type],
  } as CSSProperties

  return (
    <span className={classes.container} style={style}>
      {type}
    </span>
  )
}
