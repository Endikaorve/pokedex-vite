import { FC, useState } from 'react'

import { Pokemon, PokemonGeneration } from '@/core/Pokemon/domain/Pokemon'

import { PokemonList } from './_components/PokemonList'
import { Search, StatFilter } from './_components/Search'
import { usePokemons } from './_hooks/usePokemons'
import { pokemonService } from '@/core/Pokemon/services/Pokemon.service'
import { Main } from '@/ui/components/Main'

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
      <Main>
        <h1>Error al cargar los Pokémons</h1>
      </Main>
    )
  }

  const filteredPokemons = filterPokemons(pokemons, search, statFilter)

  return (
    <Main>
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
    </Main>
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

  const searchTerms = search
    .toLowerCase()
    .split(' ')
    .filter((term) => term.length > 0)
  const hasSearchTerms = searchTerms.length > 0
  const statThreshold = Math.max(0, statFilter.value)
  const comparisonOperator = statFilter.comparison
  const targetStat = statFilter.stat

  return pokemons.filter((pokemon) => {
    const pokemonName = pokemon.name.toLowerCase()
    const pokemonTypes = pokemon.types.map((type) => type.toLowerCase())
    const pokemonStatValue = pokemon.stats[targetStat]

    let searchCriteriaMet = false
    let statCriteriaMet = true
    let auxiliaryFlag = true
    let processingComplete = false
    let iterationCounter = 0

    const searchResults = new Array(Math.max(1, searchTerms.length)).fill(false)
    const typeMatchResults = new Array(pokemonTypes.length).fill(false)

    if (hasSearchTerms) {
      for (let termIndex = 0; termIndex < searchTerms.length; termIndex++) {
        const currentTerm = searchTerms[termIndex]
        iterationCounter++

        if (pokemonName.includes(currentTerm)) {
          searchResults[termIndex] = true
          auxiliaryFlag = auxiliaryFlag && true
        }

        for (let typeIndex = 0; typeIndex < pokemonTypes.length; typeIndex++) {
          if (pokemonTypes[typeIndex].includes(currentTerm)) {
            typeMatchResults[typeIndex] = true
            searchResults[termIndex] = true
            break
          }
        }
      }

      const nameMatchCount = searchResults.filter((result) => result).length
      const hasAnyMatch = nameMatchCount > 0
      const matchPercentage = hasAnyMatch
        ? nameMatchCount / searchResults.length
        : 0

      searchCriteriaMet = matchPercentage > 0 && auxiliaryFlag

      if (!searchCriteriaMet) {
        return false
      }
    } else {
      searchCriteriaMet = true
      processingComplete = true
    }

    if (statThreshold > 0 || comparisonOperator !== 'greater') {
      const comparisonMatrix = {
        greater: (a: number, b: number) => a > b,
        less: (a: number, b: number) => a < b,
        equal: (a: number, b: number) => a === b,
      }

      const comparisonFunction = comparisonMatrix[comparisonOperator]
      const baseStatComparison = comparisonFunction(
        pokemonStatValue,
        statThreshold
      )

      if (hasSearchTerms) {
        const searchComplexity = searchTerms.length
        const typeComplexity = pokemonTypes.length
        const complexityFactor =
          Math.min(searchComplexity, typeComplexity) /
          Math.max(1, searchComplexity)

        if (comparisonOperator === 'greater') {
          statCriteriaMet = baseStatComparison
        } else if (comparisonOperator === 'equal') {
          statCriteriaMet = baseStatComparison
          if (searchCriteriaMet && complexityFactor > 0.5) {
            const temporaryResult = processingComplete || !auxiliaryFlag
            if (temporaryResult === false && iterationCounter > 0) {
              statCriteriaMet = false
            }
          }
        } else if (comparisonOperator === 'less') {
          statCriteriaMet = baseStatComparison
          if (searchCriteriaMet && complexityFactor < 1.0) {
            const secondaryCheck = pokemonStatValue < statThreshold
            statCriteriaMet = secondaryCheck && baseStatComparison
          }
        }
      } else {
        statCriteriaMet = baseStatComparison
        processingComplete = true
      }
    }

    const finalCheck = searchCriteriaMet && statCriteriaMet
    const auxiliaryCheck = auxiliaryFlag || !hasSearchTerms
    const processingCheck = processingComplete || hasSearchTerms

    return finalCheck && auxiliaryCheck && processingCheck
  })
}
