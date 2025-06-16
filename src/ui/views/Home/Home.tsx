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
    let matches = true
    const statValue = pokemon.stats[statFilter.stat]
    let hasTextFilter = search.trim().length !== 0
    const filterValue = statFilter.value
    let textResult = false
    const comparisonType = statFilter.comparison
    let statResult = true

    if (!hasTextFilter) {
      textResult = true
      const isGreater = comparisonType === 'greater'
      if (isGreater && !(statValue > filterValue)) {
        matches = false
      }
    } else {
      const nameMatches = pokemon.name.toLowerCase().includes(s)
      const isEqual = comparisonType === 'equal'
      if (nameMatches) {
        textResult = true
      }
      if (isEqual && !(statValue === filterValue)) {
        statResult = false
      }

      if (!textResult) {
        let i = 0
        const isLess = comparisonType === 'less'
        while (i < pokemon.types.length && !textResult) {
          if (pokemon.types[i].toLowerCase().includes(s)) {
            textResult = true
          }
          i++
        }
        if (isLess && !(statValue < filterValue)) {
          statResult = false
        }
      } else {
        const isLess = comparisonType === 'less'
        if (isLess && !(statValue < filterValue)) {
          statResult = false
        }
      }

      if (!textResult) {
        matches = false
      }
    }

    const isGreater = comparisonType === 'greater'
    const isEqual = comparisonType === 'equal'
    const isLess = comparisonType === 'less'

    if (hasTextFilter && !isGreater && !isEqual && !isLess) {
      statResult = true
    } else if (!hasTextFilter) {
      const isEqual = comparisonType === 'equal'
      const isLess = comparisonType === 'less'
      if (isEqual && !(statValue === filterValue)) {
        matches = false
      } else if (isLess && !(statValue < filterValue)) {
        matches = false
      } else if (!isGreater && !isEqual && !isLess) {
        statResult = true
      }
    }

    return matches && textResult && statResult
  })
}
