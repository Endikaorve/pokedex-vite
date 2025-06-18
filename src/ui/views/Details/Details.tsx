import { FC, useState, useEffect, CSSProperties, MouseEvent } from 'react'
import { PokemonCardSkeleton } from '../Home/_components/PokemonList/_components/PokemonCardSkeleton'
import { useParams } from '@/ui/hooks/router'
import { pokemonService } from '@/core/Pokemon/services/Pokemon.service'
import { Pokemon } from '@/core/Pokemon/domain/Pokemon'
import { PokemonType as PokemonTypeModel } from '@/core/Pokemon/domain/PokemonType'
import { Main } from '@/ui/components/Main'
import { Icon } from '@/ui/components/Icon/Icon'
import { COLORS } from '@/ui/styles/utils/colors'

// Assets
import height from '@/ui/assets/height.svg'
import weight from '@/ui/assets/weight.svg'

// Type assets
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

const FAVORITES_KEY = 'favorites'

const typeImages: Record<PokemonTypeModel, string> = {
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

// Interface para DTO
interface PokemonDTO {
  id: number
  name: string
  height: number
  weight: number
  types: Array<{
    slot: number
    type: {
      name: string
    }
  }>
  sprites: {
    other: {
      'official-artwork': {
        front_default: string
      }
      dream_world: {
        front_default: string
      }
    }
  }
  stats: Array<{
    base_stat: number
    stat: {
      name:
        | 'hp'
        | 'attack'
        | 'defense'
        | 'special-attack'
        | 'special-defense'
        | 'speed'
    }
  }>
}

export const Details: FC = () => {
  const { id } = useParams()
  const [pokemon, setPokemon] = useState<Pokemon | undefined>(undefined)
  const [isValidating, setIsValidating] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Funciones utilitarias
  const getFavoriteIDs = (): string[] => {
    try {
      const favorites = localStorage.getItem(FAVORITES_KEY)
      return favorites ? JSON.parse(favorites) : []
    } catch {
      return []
    }
  }

  const buildPokemon = (
    pokemonDTO: PokemonDTO,
    favoritePokemonIDs: string[]
  ): Pokemon => {
    const mapStatsDTOToStats = (
      stats: PokemonDTO['stats']
    ): Pokemon['stats'] => {
      const statsMap = stats.reduce((acc, { base_stat, stat }) => {
        const statNameMapper: Record<
          PokemonDTO['stats'][0]['stat']['name'],
          keyof Pokemon['stats']
        > = {
          hp: 'hp',
          attack: 'attack',
          defense: 'defense',
          'special-attack': 'specialAttack',
          'special-defense': 'specialDefense',
          speed: 'speed',
        }

        const statName = statNameMapper[stat.name]

        return {
          ...acc,
          [statName]: base_stat,
        }
      }, {} as Pokemon['stats'])

      return statsMap
    }

    return {
      id: pokemonDTO.id.toString(),
      name: pokemonDTO.name,
      height: pokemonDTO.height / 10,
      weight: pokemonDTO.weight / 10,
      types: pokemonDTO.types.map(
        ({ type }) =>
          (type.name === 'psychic' ? 'psichyc' : type.name) as PokemonTypeModel
      ),
      images: {
        main: pokemonDTO.sprites.other['official-artwork'].front_default,
        alt: pokemonDTO.sprites.other.dream_world.front_default,
      },
      stats: mapStatsDTOToStats(pokemonDTO.stats),
      isFavorite: favoritePokemonIDs.includes(pokemonDTO.id.toString()),
    }
  }

  // Función para cargar pokémon por ID
  const loadPokemonById = async (pokemonId: string) => {
    try {
      setHasError(false)
      setIsValidating(true)
      setPokemon(undefined)

      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
      )

      if (!response.ok) {
        throw new Error(`Error fetching pokemon ${pokemonId}`)
      }

      const pokemonDTO: PokemonDTO = await response.json()
      const favoritePokemonIDs = getFavoriteIDs()
      const pokemonData = buildPokemon(pokemonDTO, favoritePokemonIDs)

      setPokemon(pokemonData)
    } catch (error) {
      setHasError(true)
    } finally {
      setIsValidating(false)
    }
  }

  // Effect para cargar pokémon cuando cambia el ID
  useEffect(() => {
    if (id) {
      loadPokemonById(id)
    }
  }, [id])

  if (id === undefined) {
    return (
      <Main>
        <h1>Pokémon does not exist</h1>
      </Main>
    )
  }

  if (hasError) {
    return (
      <Main>
        <h1>Error loading Pokémon</h1>
      </Main>
    )
  }

  const isLoading = pokemon === undefined || isValidating

  if (isLoading) {
    return (
      <Main>
        <PokemonCardSkeleton />
      </Main>
    )
  }

  const handleFavoriteToggle = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const updatedPokemon = pokemonService.toggleFavorite(pokemon)
    setPokemon(updatedPokemon)
  }

  const [mainType] = pokemon.types
  const normalizedCode = `#${pokemon.id.padStart(3, '0')}`

  const mainTypeColor = COLORS[mainType]

  // Componente para mostrar un tipo de Pokémon
  const PokemonTypeComponent: FC<{ type: PokemonTypeModel }> = ({ type }) => {
    const style = {
      '--type-color': COLORS[type],
    } as CSSProperties

    return (
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          borderRadius: '100px',
          height: '24px',
          backgroundColor: 'var(--type-color)',
          padding: '0 10px 0 6px',
          fontSize: '12px',
          lineHeight: '14px',
          fontWeight: '700',
          textTransform: 'capitalize',
          color: 'white',
          ...style,
        }}
      >
        <img
          src={typeImages[type]}
          alt={`type ${type}`}
          style={{ height: '18px' }}
        />
        {type}
      </span>
    )
  }

  // Componente para mostrar una estadística
  const StatComponent: FC<{ title: string; value: number }> = ({
    title,
    value,
  }) => {
    const formattedValue = value.toString().padStart(3, '0')

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '8px 0',
          fontSize: '14px',
          lineHeight: '16px',
        }}
      >
        <p
          style={{
            width: '50px',
            fontWeight: '700',
            textAlign: 'right',
            color: mainTypeColor,
          }}
        >
          {title}
        </p>
        <p style={{ width: '50px' }}>{formattedValue}</p>
        <div
          style={{
            flex: 1,
            height: '12px',
            backgroundColor: `color-mix(in srgb, ${mainTypeColor}, #ffffff 70%)`,
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(value / 255) * 100}%`,
              backgroundColor: mainTypeColor,
              borderRadius: '10px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '16px', width: '100%' }}>
      <div
        style={{
          maxWidth: '1000px',
          width: '100%',
          margin: '0 auto',
          backgroundColor: '#fff',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Header Section */}
        <div
          style={{
            background: `linear-gradient(135deg, ${mainTypeColor} 0%, color-mix(in srgb, ${mainTypeColor}, #000000 20%) 100%)`,
            padding: '40px 32px 100px',
            position: 'relative',
            color: 'white',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  textTransform: 'capitalize',
                  margin: '0 0 8px 0',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                }}
              >
                {pokemon.name}
              </h1>
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  opacity: '0.9',
                  margin: '0',
                }}
              >
                {normalizedCode}
              </p>
            </div>
            <button
              onClick={handleFavoriteToggle}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'rgba(255, 255, 255, 0.3)'
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  'rgba(255, 255, 255, 0.2)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <div style={{ fontSize: '24px' }}>
                {pokemon.isFavorite ? (
                  <Icon icon="starFilled" />
                ) : (
                  <Icon icon="star" />
                )}
              </div>
            </button>
          </div>

          {/* Types */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            {pokemon.types.map((type) => (
              <PokemonTypeComponent key={type} type={type} />
            ))}
          </div>

          {/* Pokémon Image */}
          <div
            style={{
              position: 'absolute',
              right: '32px',
              bottom: '-80px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            <img
              src={pokemon.images.main}
              alt={pokemon.name}
              style={{
                width: '140px',
                height: '140px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))',
              }}
            />
          </div>
        </div>

        {/* Content Section */}
        <div
          style={{
            padding: '40px 32px 32px',
            paddingTop: '100px',
          }}
        >
          {/* About Section */}
          <div style={{ marginBottom: '40px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '24px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '16px',
                  border: `2px solid color-mix(in srgb, ${mainTypeColor}, #ffffff 70%)`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    color: mainTypeColor,
                    fontWeight: '600',
                  }}
                >
                  <img
                    src={weight}
                    alt="weight-icon"
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span style={{ fontSize: '24px', fontWeight: '700' }}>
                    {pokemon.weight} kg
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '14px',
                    color: '#666',
                    fontWeight: '500',
                  }}
                >
                  Weight
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '24px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '16px',
                  border: `2px solid color-mix(in srgb, ${mainTypeColor}, #ffffff 70%)`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    color: mainTypeColor,
                    fontWeight: '600',
                  }}
                >
                  <img
                    src={height}
                    alt="height-icon"
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span style={{ fontSize: '24px', fontWeight: '700' }}>
                    {pokemon.height} m
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '14px',
                    color: '#666',
                    fontWeight: '500',
                  }}
                >
                  Height
                </span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: mainTypeColor,
                marginBottom: '24px',
                borderBottom: `3px solid ${mainTypeColor}`,
                paddingBottom: '8px',
                display: 'inline-block',
              }}
            >
              Base Stats
            </h2>

            <div
              style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '16px',
                padding: '24px',
                border: `2px solid color-mix(in srgb, ${mainTypeColor}, #ffffff 70%)`,
              }}
            >
              <StatComponent title="HP" value={pokemon.stats.hp} />
              <StatComponent title="ATK" value={pokemon.stats.attack} />
              <StatComponent title="DEF" value={pokemon.stats.defense} />
              <StatComponent title="SATK" value={pokemon.stats.specialAttack} />
              <StatComponent
                title="SDEF"
                value={pokemon.stats.specialDefense}
              />
              <StatComponent title="SPD" value={pokemon.stats.speed} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
