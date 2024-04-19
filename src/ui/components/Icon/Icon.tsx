import { FC } from 'react'
import { Star } from './icons/Star'
import { StarFilled } from './icons/StarFilled'

const icons = {
  star: Star,
  starFilled: StarFilled,
}

type Icon = keyof typeof icons

interface Props {
  icon: Icon
}

export const Icon: FC<Props> = ({ icon }) => {
  const SelectedIcon = icons[icon]

  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ color: 'inherit' }}
    >
      <SelectedIcon />
    </svg>
  )
}
