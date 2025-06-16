import { FC, useState } from 'react'
import { useFavorites } from './_hooks/useFavorites'
import { useTeamAnalysis } from './_hooks/useTeamAnalysis'
import { PokemonList } from '../Home/_components/PokemonList'
import { TeamAnalysis } from './_components/TeamAnalysis'
import { Pokemon } from '@/core/Pokemon/domain/Pokemon'
import { pokemonService } from '@/core/Pokemon/services/Pokemon.service'
import { Main } from '@/ui/components/Main'
import styles from './Favorites.module.css'

export const Favorites: FC = () => {
  const { pokemons, hasError, mutate } = useFavorites()
  const {
    analysis,
    canAnalyze,
    error: analysisError,
  } = useTeamAnalysis(pokemons)
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

      {pokemons && pokemons.length > 0 && (
        <div className={styles.analyzeSection}>
          <button
            onClick={handleAnalyzeTeam}
            disabled={!canAnalyze}
            className={styles.analyzeButton}
          >
            {showAnalysis ? 'Ocultar Análisis' : 'Analizar Equipo'}
          </button>

          {analysisError && (
            <p className={styles.errorMessage}>{analysisError}</p>
          )}
        </div>
      )}

      {showAnalysis && analysis && <TeamAnalysis analysis={analysis} />}
    </Main>
  )
}
