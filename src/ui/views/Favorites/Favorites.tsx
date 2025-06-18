import { FC, useState } from 'react'
import { useFavorites } from './_hooks/useFavorites'
import { PokemonList } from '../Home/_components/PokemonList'
import { TeamAnalysis } from './_components/TeamAnalysis'
import { Pokemon } from '@/core/Pokemon/domain/Pokemon'
import { pokemonService } from '@/core/Pokemon/services/Pokemon.service'
import { Main } from '@/ui/components/Main'
import styles from './Favorites.module.css'

export const Favorites: FC = () => {
  const { pokemons, hasError, mutate } = useFavorites()
  const [showAnalysis, setShowAnalysis] = useState(false)

  const handleFavoriteToggle = (pokemon: Pokemon) => {
    const updatedPokemon = pokemonService.toggleFavorite(pokemon)

    const updatedPokemons = pokemons?.map((pokemon) =>
      pokemon.id === updatedPokemon.id ? updatedPokemon : pokemon
    )

    mutate(updatedPokemons)
  }

  const handleAnalyzeTeam = () => {
    setShowAnalysis(!showAnalysis)
  }

  const canAnalyze = pokemons && pokemons.length > 0 && pokemons.length <= 6
  const analysisError =
    pokemons && pokemons.length > 6
      ? 'Team cannot have more than 6 Pokémon'
      : null

  if (hasError) {
    return (
      <Main>
        <h1>Error loading Favorite Pokémons</h1>
      </Main>
    )
  }

  return (
    <Main>
      <PokemonList
        pokemons={pokemons}
        onFavoriteToggle={handleFavoriteToggle}
      />

      {pokemons && pokemons.length > 0 && (
        <div className={styles.analyzeSection}>
          <button
            onClick={handleAnalyzeTeam}
            disabled={!canAnalyze}
            className={styles.analyzeButton}
          >
            {showAnalysis ? 'Hide Analysis' : 'Analyze Team'}
          </button>

          {analysisError && (
            <p className={styles.errorMessage}>{analysisError}</p>
          )}
        </div>
      )}

      {showAnalysis && canAnalyze && pokemons && (
        <TeamAnalysis team={pokemons} />
      )}
    </Main>
  )
}
