import { FC } from 'react'
import { usePokemon } from './_hooks/usePokemon'
import { PokemonCard } from '../Home/_components/PokemonList/_components/PokemonCard'
import { PokemonCardSkeleton } from '../Home/_components/PokemonList/_components/PokemonCardSkeleton'
import { useParams } from '@/ui/hooks/router'
import { pokemonService } from '@/core/Pokemon/services/Pokemon.service'
import { Main } from '@/ui/components/Main'

export const Details: FC = () => {
  const { id } = useParams()

  if (id === undefined) {
    return (
      <Main>
        <h1>El Pokémon no existe</h1>
      </Main>
    )
  }

  const { pokemon, isValidating, hasError, mutate } = usePokemon(id)

  if (hasError) {
    return (
      <Main>
        <h1>Error al cargar el Pokémon</h1>
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

    mutate(updatedPokemon, {
      revalidate: false,
    })
  }

  return (
    <Main>
      <PokemonCard pokemon={pokemon} onFavoriteToggle={handleFavoriteToggle} />
    </Main>
  )
}
