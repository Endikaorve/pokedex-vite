import useSWR from 'swr'

// interface QueryOptions {
//   enabled?: boolean;
//   retry?: boolean;
//   refetchOnWindowFocus?: boolean;
//   refetchOnMount?: boolean;
//   refetchOnReconnect?: boolean;
//   disableCache?: boolean;
// }

interface QueryService<Data> {
  data: Data | undefined
  isValidating: boolean
  hasError: boolean
  mutate: (
    data: Data | undefined,
    options?: {
      revalidate: boolean
    }
  ) => Promise<Data | undefined>
}

export const useQueryService = <Data>(
  key: string,
  deps: unknown[],
  service: (() => Promise<Data>) | (() => Data)
  // config?: QueryOptions,
): QueryService<Data> => {
  // Usa solo los valores definidos para las dependencias. Así, mismos usos
  // con paso de parámetros distinto funcionan igual. P.e. un opcional
  // "(x?: Type) => Promise" que en un caso no se le pasa parámetro "()" y en
  // otro se le pasa una variable que es undefined "(noExiste)".
  const query = useSWR<Data>(
    [key, ...deps.filter((dep) => dep !== undefined)],
    service
  )

  return {
    data: query.data,
    isValidating: query.isValidating,
    hasError: Boolean(query.error),
    mutate: query.mutate,
  }
}
