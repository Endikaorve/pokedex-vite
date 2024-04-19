import { pokemonService } from '@/core/Pokemon/services/Pokemon.service'
import { useQueryService } from '@/ui/hooks/useQueryService'

export const useFavorites = () => {
  const { data, hasError, mutate } = useQueryService(
    'pokemon.listFavorites',
    [],
    () => pokemonService.listFavorites()
  )

  return { pokemons: data, hasError, mutate }
}
