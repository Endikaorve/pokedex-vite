import { FC } from 'react'
import { useFavorites } from './_hooks/useFavorites'
import { PokemonList } from '../Home/_components/PokemonList'
import { Pokemon } from '@/core/Pokemon/domain/Pokemon'
import { pokemonService } from '@/core/Pokemon/services/Pokemon.service'
import { Main } from '@/ui/components/Main'

export const Favorites: FC = () => {
  const { pokemons, hasError, mutate } = useFavorites()

  const handleFavoriteToggle = (pokemon: Pokemon) => {
    const updatedPokemon = pokemonService.toggleFavorite(pokemon)

    const updatedPokemons = pokemons?.map((pokemon) =>
      pokemon.id === updatedPokemon.id ? updatedPokemon : pokemon
    )

    mutate(updatedPokemons)
  }

  if (hasError) {
    return (
      <Main>
        <h1>Error al cargar los Pokémons Favoritos</h1>
      </Main>
    )
  }

  return (
    <Main>
      <PokemonList
        pokemons={pokemons}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </Main>
  )
}
