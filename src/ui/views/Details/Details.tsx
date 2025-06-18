import { FC, useState, useEffect } from 'react'
import { PokemonCard } from '../Home/_components/PokemonList/_components/PokemonCard'
import { PokemonCardSkeleton } from '../Home/_components/PokemonList/_components/PokemonCardSkeleton'
import { useParams } from '@/ui/hooks/router'
import { pokemonService } from '@/core/Pokemon/services/Pokemon.service'
import { Pokemon } from '@/core/Pokemon/domain/Pokemon'
import { PokemonType } from '@/core/Pokemon/domain/PokemonType'
import { Main } from '@/ui/components/Main'

const FAVORITES_KEY = 'favorites'

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
          (type.name === 'psychic' ? 'psichyc' : type.name) as PokemonType
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

  const handleFavoriteToggle = () => {
    const updatedPokemon = pokemonService.toggleFavorite(pokemon)
    setPokemon(updatedPokemon)
  }

  return (
    <Main>
      <PokemonCard pokemon={pokemon} onFavoriteToggle={handleFavoriteToggle} />
    </Main>
  )
}
