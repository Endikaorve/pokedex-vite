import { FC, useState } from 'react'

import { Pokemon, PokemonGeneration } from '@/core/Pokemon/domain/Pokemon'

import { PokemonList } from './_components/PokemonList'
import { Search, StatFilter } from './_components/Search'
import classes from './Home.module.css'
import { usePokemons } from './_hooks/usePokemons'
import { pokemonService } from '@/core/Pokemon/services/Pokemon.service'

export const Home: FC = () => {
  const [generation, setGeneration] = useState<PokemonGeneration>('Kanto')
  const [search, setSearch] = useState<string>('')
  const [statFilter, setStatFilter] = useState<StatFilter>({
    stat: 'hp',
    comparison: 'greater',
    value: 0,
  })
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

  const filteredPokemons = filterPokemons(pokemons, search, statFilter)

  return (
    <main className={classes.container}>
      <Search
        generation={generation}
        search={search}
        statFilter={statFilter}
        onGenerationChange={setGeneration}
        onSearchChange={setSearch}
        onStatFilterChange={setStatFilter}
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
  search: string,
  statFilter: StatFilter
): Pokemon[] | undefined => {
  if (!pokemons) {
    return pokemons
  }

  return pokemons.filter((pokemon) => {
    const lowerCaseSearch = search.toLowerCase()
    const pokemonStatValue =
      pokemon.stats[statFilter.stat as keyof Pokemon['stats']]

    const matchesTextSearch =
      !search.trim() ||
      pokemon.name.toLowerCase().includes(lowerCaseSearch) ||
      pokemon.types.some((type) => type.toLowerCase().includes(lowerCaseSearch))

    const matchesStatFilter = (() => {
      switch (statFilter.comparison) {
        case 'greater':
          return pokemonStatValue > statFilter.value
        case 'equal':
          return pokemonStatValue === statFilter.value
        case 'less':
          return pokemonStatValue < statFilter.value
        default:
          return true
      }
    })()

    return matchesTextSearch && matchesStatFilter
  })
}
