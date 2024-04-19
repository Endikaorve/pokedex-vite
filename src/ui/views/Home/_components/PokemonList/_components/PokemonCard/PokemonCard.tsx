import height from '@/ui/assets/height.svg'
import weight from '@/ui/assets/weight.svg'

import { CSSProperties, FC, MouseEvent } from 'react'

import { Pokemon } from '@/core/Pokemon/domain/Pokemon'
import { COLORS } from '@/ui/styles/utils/colors'

import { PokemonType } from './_components/PokemonType'
import { Link } from '@/ui/components/Link'

// import classes from "./PokemonCard.module.css";
import { PokemonStats } from './_components/PokemonStats/PokemonStats'
import { Icon } from '@/ui/components/Icon/Icon'

interface Props {
  pokemon: Pokemon
  onFavoriteToggle: (pokemon: Pokemon) => void
}

export const PokemonCard: FC<Props> = ({ pokemon, onFavoriteToggle }) => {
  const toggleFavorite = async (event: MouseEvent) => {
    event.preventDefault()

    onFavoriteToggle(pokemon)
  }

  const [mainType] = pokemon.types
  const style = {
    '--main-type': COLORS[mainType],
  } as CSSProperties

  const normalizedCode = `#${pokemon.id.padStart(3, '0')}`

  return (
    <Link route={{ path: 'details', params: { id: pokemon.id } }}>
      <div className="poke-card" style={style}>
        <div className="poke-card-header">
          <div className="poke-card-header-name">{pokemon.name}</div>
          <div className="poke-card-header-code">{normalizedCode}</div>
        </div>
        <div className="poke-card-body">
          <img
            className="poke-card-body-pokemon-img"
            src={pokemon.images.main}
            alt="pokemon"
          />
          <div className="poke-card-body-favorite-container">
            <button
              className="poke-card-body-favorite-button"
              onClick={toggleFavorite}
            >
              {pokemon.isFavorite ? (
                <Icon icon="starFilled" />
              ) : (
                <Icon icon="star" />
              )}
            </button>
          </div>
          <div className="poke-card-body-types">
            {pokemon.types.map((type) => (
              <PokemonType key={type} type={type} />
            ))}
          </div>
          <div className="poke-card-body-about">About</div>
          <div className="poke-card-body-details">
            <div className="poke-card-body-details-content">
              <div className="poke-card-body-details-content-data">
                <img
                  className="poke-card-body-details-content-data-img"
                  src={weight}
                  alt="weight-icon"
                />
                {pokemon.weight} kg
              </div>
              <div className="poke-card-body-details-content-title">Weight</div>
            </div>

            <div className="poke-card-body-details-content">
              <div className="poke-card-body-details-content-data">
                <img
                  className="poke-card-body-details-content-data-img"
                  src={height}
                  alt="height-icon"
                />
                {pokemon.height} m
              </div>
              <div className="poke-card-body-details-content-title">Height</div>
            </div>
          </div>
          <PokemonStats stats={pokemon.stats} />
        </div>
      </div>
    </Link>
  )
}
