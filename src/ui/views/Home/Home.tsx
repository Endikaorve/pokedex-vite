import { FC, useState } from 'react'

import { Pokemon, PokemonGeneration } from '@/core/Pokemon/domain/Pokemon'

import { PokemonList } from './_components/PokemonList'
import { Search } from './_components/Search'
import classes from './Home.module.css'
import { usePokemons } from './_hooks/usePokemons'
import { pokemonService } from '@/core/Pokemon/services/Pokemon.service'

export const Home: FC = () => {
  const [generation, setGeneration] = useState<PokemonGeneration>('Kanto')
  const [search, setSearch] = useState<string>('')
  const { pokemons, hasError, mutate } = usePokemons(generation)

  const handleFavoriteToggle = (pokemon: Pokemon) => {
    const updatedPokemon = pokemonService.toggleFavorite(pokemon)

    const updatedPokemons = pokemons?.map((pokemon) =>
      pokemon.id === updatedPokemon.id ? updatedPokemon : pokemon
    )

    mutate(updatedPokemons, {
      revalidate: false,
    })
  }

  if (hasError) {
    return (
      <main>
        <h1>Error al cargar los Pokémons</h1>
      </main>
    )
  }

  const filteredPokemons = filterPokemons(pokemons, search)

  return (
    <main className={classes.container}>
      <Search
        generation={generation}
        search={search}
        onGenerationChange={setGeneration}
        onSearchChange={setSearch}
      />
      <PokemonList
        pokemons={filteredPokemons}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </main>
  )
}

const filterPokemons = (
  pokemons: Pokemon[] | undefined,
  search: string
): Pokemon[] | undefined => {
  if (!pokemons) return pokemons

  if (!search.trim()) return pokemons

  const lowerCaseSearch = search.toLowerCase()

  return pokemons.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(lowerCaseSearch) ||
      pokemon.types.some((type) => type.toLowerCase().includes(lowerCaseSearch))
  )
}
