import { Pokemon } from '@/core/Pokemon/domain/Pokemon'
import { pokemonService } from '@/core/Pokemon/services/Pokemon.service'
import { useQueryService } from '@/ui/hooks/useQueryService'

export const usePokemon = (id: Pokemon['id']) => {
  const { data, isValidating, hasError, mutate } = useQueryService(
    'pokemon.getById',
    [],
    () => pokemonService.getById(id)
  )

  return { pokemon: data, isValidating, hasError, mutate }
}
