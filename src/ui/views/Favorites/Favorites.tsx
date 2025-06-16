import { FC, useState } from 'react'
import { useFavorites } from './_hooks/useFavorites'
import { useTeamAnalysis } from './_hooks/useTeamAnalysis'
import { PokemonList } from '../Home/_components/PokemonList'
import { TeamAnalysis } from './_components/TeamAnalysis'
import { Pokemon } from '@/core/Pokemon/domain/Pokemon'
import { pokemonService } from '@/core/Pokemon/services/Pokemon.service'
import { Main } from '@/ui/components/Main'

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
        <div style={{ textAlign: 'center', margin: '24px 0' }}>
          <button
            onClick={handleAnalyzeTeam}
            disabled={!canAnalyze}
            style={{
              padding: '12px 24px',
              backgroundColor: canAnalyze ? '#3B82F6' : '#9CA3AF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: canAnalyze ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s ease',
            }}
          >
            {showAnalysis ? 'Ocultar Análisis' : 'Analizar Equipo'}
          </button>

          {analysisError && (
            <p style={{ color: '#EF4444', marginTop: '8px', fontSize: '14px' }}>
              {analysisError}
            </p>
          )}
        </div>
      )}

      {showAnalysis && analysis && <TeamAnalysis analysis={analysis} />}
    </Main>
  )
}
