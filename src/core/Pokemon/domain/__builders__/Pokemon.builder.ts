import { Pokemon } from '../Pokemon'

export const pokemonBuilder = (options?: Partial<Pokemon>) => {
  const defaults: Pokemon = {
    id: 'irrelevantId',
    name: 'irrelevantName',
    height: 0,
    weight: 0,
    types: [],
    images: {
      main: 'irrelevantMainImage',
      alt: 'irrelevantAltImage',
    },
    stats: {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
    },
    isFavorite: false,
  }

  return {
    build() {
      return Object.assign({}, defaults, options)
    },
  }
}
