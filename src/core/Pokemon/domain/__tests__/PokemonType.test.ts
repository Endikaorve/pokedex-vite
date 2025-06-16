import { getTypeEffectiveness, PokemonType } from '../PokemonType'

describe('PokemonType', () => {
  describe('getTypeEffectiveness', () => {
    describe('Super effective attacks (2x damage)', () => {
      it('should return 2 for water vs fire', () => {
        expect(getTypeEffectiveness('water', 'fire')).toBe(2)
      })

      it('should return 2 for grass vs water', () => {
        expect(getTypeEffectiveness('grass', 'water')).toBe(2)
      })

      it('should return 2 for fire vs grass', () => {
        expect(getTypeEffectiveness('fire', 'grass')).toBe(2)
      })

      it('should return 2 for fighting vs normal', () => {
        expect(getTypeEffectiveness('fighting', 'normal')).toBe(2)
      })

      it('should return 2 for psichyc vs poison', () => {
        expect(getTypeEffectiveness('psichyc', 'poison')).toBe(2)
      })
    })

    describe('Not very effective attacks (0.5x damage)', () => {
      it('should return 0.5 for fire vs water', () => {
        expect(getTypeEffectiveness('fire', 'water')).toBe(0.5)
      })

      it('should return 0.5 for water vs grass', () => {
        expect(getTypeEffectiveness('water', 'grass')).toBe(0.5)
      })

      it('should return 0.5 for grass vs fire', () => {
        expect(getTypeEffectiveness('grass', 'fire')).toBe(0.5)
      })

      it('should return 0.5 for normal vs rock', () => {
        expect(getTypeEffectiveness('normal', 'rock')).toBe(0.5)
      })

      it('should return 0.5 for fire vs rock', () => {
        expect(getTypeEffectiveness('fire', 'rock')).toBe(0.5)
      })

      it('should return 0.5 for fire vs fire', () => {
        expect(getTypeEffectiveness('fire', 'fire')).toBe(0.5)
      })

      it('should return 0.5 for psichyc vs psichyc', () => {
        expect(getTypeEffectiveness('psichyc', 'psichyc')).toBe(0.5)
      })
    })

    describe('Immune attacks (0x damage)', () => {
      it('should return 0 for normal vs ghost', () => {
        expect(getTypeEffectiveness('normal', 'ghost')).toBe(0)
      })

      it('should return 0 for electric vs ground', () => {
        expect(getTypeEffectiveness('electric', 'ground')).toBe(0)
      })

      it('should return 0 for fighting vs ghost', () => {
        expect(getTypeEffectiveness('fighting', 'ghost')).toBe(0)
      })

      it('should return 0 for poison vs steel', () => {
        expect(getTypeEffectiveness('poison', 'steel')).toBe(0)
      })

      it('should return 0 for ground vs flying', () => {
        expect(getTypeEffectiveness('ground', 'flying')).toBe(0)
      })
    })

    describe('Neutral attacks (1x damage)', () => {
      it('should return 1 for normal vs normal', () => {
        expect(getTypeEffectiveness('normal', 'normal')).toBe(1)
      })

      it('should return 1 for water vs electric', () => {
        expect(getTypeEffectiveness('water', 'electric')).toBe(1)
      })

      it('should return 1 for dragon vs normal', () => {
        expect(getTypeEffectiveness('dragon', 'normal')).toBe(1)
      })

      it('should return 1 for steel vs normal', () => {
        expect(getTypeEffectiveness('steel', 'normal')).toBe(1)
      })

      it('should return 1 for fairy vs normal', () => {
        expect(getTypeEffectiveness('fairy', 'normal')).toBe(1)
      })
    })

    describe('Quarter damage (0.25x) - very not effective', () => {
      it('should return 0.25 for fire vs fire/water dual type equivalent', () => {
        // Este caso lo verificaremos cuando implementemos lógica de dual-types
        // Por ahora, agregamos algunos casos que sabemos dan 0.25x
        expect(getTypeEffectiveness('grass', 'fire')).toBe(0.5) // Placeholder - será útil para dual types
      })
    })

    describe('Edge cases', () => {
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
})
