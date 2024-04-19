import { FC } from 'react'

export const PokemonCardSkeleton: FC = () => (
  <div className="poke-card-skeleton">
    <div className="poke-card-skeleton-header">
      <div className="poke-card-skeleton-header-name" />
      <div className="poke-card-skeleton-header-code" />
    </div>
    <div className="poke-card-skeleton-body">
      <div className="poke-card-skeleton-body-pokemon-img" />
      <div className="poke-card-skeleton-body-types">
        {Array.from(Array(2).keys()).map((index) => (
          <span key={index} className="poke-card-skeleton-body-type-badge" />
        ))}
      </div>
      <div className="poke-card-skeleton-body-details">
        <div className="poke-card-skeleton-body-details-content" />
      </div>
      <div className="poke-card-skeleton-body-description" />
    </div>
  </div>
)
