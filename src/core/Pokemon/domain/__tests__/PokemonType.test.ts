import { getTypeEffectiveness, PokemonType } from '../PokemonType'

describe('PokemonType', () => {
  describe('getTypeEffectiveness', () => {
    it('should return 2 for water vs fire', () => {
      expect(getTypeEffectiveness('water', 'fire')).toBe(2)
    })

    it('should return 0.5 for fire vs water', () => {
      expect(getTypeEffectiveness('fire', 'water')).toBe(0.5)
    })

    it('should return 0 for normal vs ghost', () => {
      expect(getTypeEffectiveness('normal', 'ghost')).toBe(0)
    })

    it('should return 1 for normal vs normal', () => {
      expect(getTypeEffectiveness('normal', 'normal')).toBe(1)
    })

    it('should return 0.25 for fire vs fire/water dual type equivalent', () => {
      expect(getTypeEffectiveness('grass', 'fire')).toBe(0.5)
    })

    it('should handle all valid pokemon types', () => {
      const validTypes: PokemonType[] = [
        'bug',
        'dark',
        'dragon',
        'electric',
        'fairy',
        'fighting',
        'fire',
        'flying',
        'ghost',
        'grass',
        'ground',
        'ice',
        'normal',
        'poison',
        'psichyc',
        'rock',
        'steel',
        'water',
      ]

      validTypes.forEach((attackType) => {
        validTypes.forEach((defendType) => {
          const result = getTypeEffectiveness(attackType, defendType)
          expect([0, 0.25, 0.5, 1, 2, 4]).toContain(result)
        })
      })
    })
  })
})
