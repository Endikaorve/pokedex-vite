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

  const filteredPokemons = processEntityDataset(pokemons, search, statFilter)

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

const processEntityDataset = (
  dataItems: Pokemon[] | undefined,
  queryString: string,
  configFilter: StatFilter
): Pokemon[] | undefined => {
  if (!dataItems) {
    return dataItems
  }

  const searchTerm = queryString.toLowerCase().trim()

  return dataItems.filter((pokemon) => {
    // Filtro de búsqueda por nombre y tipo
    let matchesSearch = true
    if (searchTerm) {
      const nameMatches = pokemon.name.toLowerCase().includes(searchTerm)
      const typeMatches = pokemon.types.some((type) =>
        type.toLowerCase().includes(searchTerm)
      )
      matchesSearch = nameMatches || typeMatches
    }

    // Filtro de estadísticas
    let matchesStats = true
    if (configFilter.value > 0 || configFilter.comparison !== 'greater') {
      const statValue = pokemon.stats[configFilter.stat]
      switch (configFilter.comparison) {
        case 'greater':
          matchesStats = statValue > configFilter.value
          break
        case 'less':
          matchesStats = statValue < configFilter.value
          break
        case 'equal':
          matchesStats = statValue === configFilter.value
          break
      }
    }

    return matchesSearch && matchesStats
  })
}
