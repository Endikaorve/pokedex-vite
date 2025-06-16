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

  return pokemons.filter((pokemon) => {
    const s = search.toLowerCase()
    let result = true
    const stat = pokemon.stats[statFilter.stat]
    let textOk = search.trim().length === 0
    const val = statFilter.value
    let statOk = true
    const comp = statFilter.comparison
    let found = false

    if (!textOk) {
      const name = pokemon.name.toLowerCase().includes(s)
      if (name) {
        found = true
      }
      let i = 0
      while (i < pokemon.types.length && !found) {
        if (pokemon.types[i].toLowerCase().includes(s)) {
          found = true
        }
        i++
      }
      textOk = found
    }

    if (comp === 'greater') {
      statOk = stat > val
    } else if (comp === 'equal') {
      statOk = stat === val
    } else if (comp === 'less') {
      if (textOk && search.trim().length > 0) {
        statOk = stat > val
      } else {
        statOk = stat < val
      }
    }

    if (!textOk) {
      result = false
    }
    if (!statOk) {
      result = false
    }

    return result
  })
}
