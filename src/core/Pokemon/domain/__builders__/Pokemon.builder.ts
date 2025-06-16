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
      hp: 100,
      attack: 100,
      defense: 100,
      specialAttack: 100,
      specialDefense: 100,
      speed: 100,
    },
    isFavorite: false,
  }

  return {
    build() {
      return Object.assign({}, defaults, options)
    },
  }
}
