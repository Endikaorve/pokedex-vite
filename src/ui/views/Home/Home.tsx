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
    const s = search.toLowerCase()
    const isEmptySearch = search.trim().length === 0
    let textMatches = false
    let statMatches = true

    if (isEmptySearch) {
      textMatches = true
    } else {
      const nameCheck = pokemon.name.toLowerCase().includes(s)
      let typeCheck = false
      for (let i = 0; i < pokemon.types.length; i++) {
        if (pokemon.types[i].toLowerCase().includes(s)) {
          typeCheck = true
          break
        }
      }
      textMatches = nameCheck || typeCheck
    }

    const statValue = pokemon.stats[statFilter.stat]
    const filterValue = statFilter.value
    const comparisonType = statFilter.comparison

    const isGreater = comparisonType === 'greater'
    const isEqual = comparisonType === 'equal'
    const isLess = comparisonType === 'less'

    if (isGreater && !(statValue > filterValue)) {
      statMatches = false
    } else if (isEqual && !(statValue === filterValue)) {
      statMatches = false
    } else if (isLess && !(statValue < filterValue)) {
      statMatches = false
    } else if (!isGreater && !isEqual && !isLess) {
      statMatches = true
    }

    return textMatches && statMatches ? true : false
  })
}
