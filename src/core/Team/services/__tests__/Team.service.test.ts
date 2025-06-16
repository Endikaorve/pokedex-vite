import { teamService } from '../Team.service'
import { Team } from '../../domain/Team'
import { Pokemon } from '@/core/Pokemon/domain/Pokemon'
const mockCharizard: Pokemon = {
  id: '6',
  name: 'Charizard',
  height: 17,
  weight: 905,
  types: ['fire', 'flying'],
  images: {
    main: 'charizard.png',
    alt: 'charizard-alt.png',
  },
  stats: {
    hp: 78,
    attack: 84,
    defense: 78,
    specialAttack: 109,
    specialDefense: 85,
    speed: 100,
  },
  isFavorite: false,
}

const mockBlastoise: Pokemon = {
  id: '9',
  name: 'Blastoise',
  height: 16,
  weight: 855,
  types: ['water'],
  images: {
    main: 'blastoise.png',
    alt: 'blastoise-alt.png',
  },
  stats: {
    hp: 79,
    attack: 83,
    defense: 100,
    specialAttack: 85,
    specialDefense: 105,
    speed: 78,
  },
  isFavorite: false,
}

const mockVenusaur: Pokemon = {
  id: '3',
  name: 'Venusaur',
  height: 20,
  weight: 1000,
  types: ['grass', 'poison'],
  images: {
    main: 'venusaur.png',
    alt: 'venusaur-alt.png',
  },
  stats: {
    hp: 80,
    attack: 82,
    defense: 83,
    specialAttack: 100,
    specialDefense: 100,
    speed: 80,
  },
  isFavorite: false,
}

const mockGengar: Pokemon = {
  id: '94',
  name: 'Gengar',
  height: 15,
  weight: 405,
  types: ['ghost', 'poison'],
  images: {
    main: 'gengar.png',
    alt: 'gengar-alt.png',
  },
  stats: {
    hp: 60,
    attack: 65,
    defense: 60,
    specialAttack: 130,
    specialDefense: 75,
    speed: 110,
  },
  isFavorite: false,
}

describe('Team Service', () => {
  describe('analyze', () => {
    describe('Team validation', () => {
      it('should throw error for empty team', () => {
        const emptyTeam: Team = []

        expect(() => teamService.analyze(emptyTeam)).toThrow(
          'Team must have at least 1 Pokémon'
        )
      })

      it('should throw error for team with more than 6 Pokémon', () => {
        const oversizedTeam: Team = [
          mockCharizard,
          mockBlastoise,
          mockVenusaur,
          mockGengar,
          mockCharizard,
          mockBlastoise,
          mockVenusaur,
        ]

        expect(() => teamService.analyze(oversizedTeam)).toThrow(
          'Team cannot have more than 6 Pokémon'
        )
      })

      it('should accept team with 1-6 Pokémon', () => {
        const validTeam: Team = [mockCharizard]

        expect(() => teamService.analyze(validTeam)).not.toThrow()
      })
    })

    describe('Defense analysis', () => {
      it('should calculate immune defense (0x damage)', () => {
        const team: Team = [mockGengar]
        const result = teamService.analyze(team)

        const normalDefense = result.defense.find((d) => d.type === 'normal')
        expect(normalDefense?.teamWeakness).toContain('immune')
      })

      it('should calculate very resistant defense (0.25x damage)', () => {
        const team: Team = [mockCharizard]
        const result = teamService.analyze(team)

        const grassDefense = result.defense.find((d) => d.type === 'grass')
        expect(grassDefense?.teamWeakness).toContain('very-resistant')
      })

      it('should calculate resistant defense (0.5x damage)', () => {
        const team: Team = [mockBlastoise]
        const result = teamService.analyze(team)

        const fireDefense = result.defense.find((d) => d.type === 'fire')
        expect(fireDefense?.teamWeakness).toContain('resistant')
      })

      it('should calculate neutral defense (1x damage)', () => {
        const team: Team = [mockBlastoise]
        const result = teamService.analyze(team)

        const normalDefense = result.defense.find((d) => d.type === 'normal')
        expect(normalDefense?.teamWeakness).toContain('neutral')
      })

      it('should calculate weak defense (2x damage)', () => {
        const team: Team = [mockBlastoise]
        const result = teamService.analyze(team)

        const grassDefense = result.defense.find((d) => d.type === 'grass')
        expect(grassDefense?.teamWeakness).toContain('weak')
      })

      it('should calculate very weak defense (4x damage)', () => {
        const team: Team = [mockCharizard]
        const result = teamService.analyze(team)

        const rockDefense = result.defense.find((d) => d.type === 'rock')
        expect(rockDefense?.teamWeakness).toContain('very-weak')
      })

      it('should handle dual-type pokemon defense calculation', () => {
        const team: Team = [mockVenusaur]
        const result = teamService.analyze(team)

        const psychicDefense = result.defense.find((d) => d.type === 'psichyc')
        expect(psychicDefense?.teamWeakness).toContain('weak')
      })

      it('should analyze team defense for all 18 types', () => {
        const team: Team = [mockCharizard]
        const result = teamService.analyze(team)

        expect(result.defense).toHaveLength(18)

        const expectedTypes = [
          'normal',
          'fire',
          'water',
          'electric',
          'grass',
          'ice',
          'fighting',
          'poison',
          'ground',
          'flying',
          'psichyc',
          'bug',
          'rock',
          'ghost',
          'dragon',
          'dark',
          'steel',
          'fairy',
        ]

        expectedTypes.forEach((type) => {
          expect(result.defense.some((d) => d.type === type)).toBe(true)
        })
      })

      it('should handle multiple Pokémon in team defense', () => {
        const team: Team = [mockCharizard, mockBlastoise]
        const result = teamService.analyze(team)

        const grassDefense = result.defense.find((d) => d.type === 'grass')
        expect(grassDefense?.teamWeakness).toHaveLength(2)
        expect(grassDefense?.teamWeakness).toContain('very-resistant')
        expect(grassDefense?.teamWeakness).toContain('weak')
      })
    })

    describe('Offense analysis', () => {
      it('should detect offensive coverage against single type', () => {
        const team: Team = [mockBlastoise]
        const result = teamService.analyze(team)

        const fireCoverage = result.offense.find((o) => o.type === 'fire')
        expect(fireCoverage?.coverage).toBe(1)
      })

      it('should detect no offensive coverage against type', () => {
        const team: Team = [mockBlastoise]
        const result = teamService.analyze(team)

        const waterCoverage = result.offense.find((o) => o.type === 'water')
        expect(waterCoverage?.coverage).toBe(0)
      })

      it('should analyze full team offensive coverage', () => {
        const team: Team = [mockCharizard, mockBlastoise, mockVenusaur]
        const result = teamService.analyze(team)

        expect(result.offense).toHaveLength(18)

        const fireCoverage = result.offense.find((o) => o.type === 'fire')
        expect(fireCoverage?.coverage).toBe(1)

        const waterCoverage = result.offense.find((o) => o.type === 'water')
        expect(waterCoverage?.coverage).toBe(1)
      })

      it('should handle dual-type attacking pokemon', () => {
        const team: Team = [mockCharizard]
        const result = teamService.analyze(team)

        const grassCoverage = result.offense.find((o) => o.type === 'grass')
        expect(grassCoverage?.coverage).toBe(1)

        const fightingCoverage = result.offense.find(
          (o) => o.type === 'fighting'
        )
        expect(fightingCoverage?.coverage).toBe(1)
      })

      it('should count multiple pokemon with coverage against same type', () => {
        const team: Team = [mockCharizard, mockVenusaur]
        const result = teamService.analyze(team)

        const grassCoverage = result.offense.find((o) => o.type === 'grass')
        expect(grassCoverage?.coverage).toBe(2)

        const steelCoverage = result.offense.find((o) => o.type === 'steel')
        expect(steelCoverage?.coverage).toBe(1)

        const fireCoverage = result.offense.find((o) => o.type === 'fire')
        expect(fireCoverage?.coverage).toBe(0)
      })
    })

    describe('Integration tests', () => {
      it('should return complete analysis for balanced team', () => {
        const team: Team = [mockCharizard, mockBlastoise, mockVenusaur]
        const result = teamService.analyze(team)

        expect(result.defense).toHaveLength(18)
        result.defense.forEach((defense) => {
          expect(defense.type).toBeDefined()
          expect(defense.teamWeakness).toHaveLength(3)
          defense.teamWeakness.forEach((weakness) => {
            expect([
              'immune',
              'very-resistant',
              'resistant',
              'neutral',
              'weak',
              'very-weak',
            ]).toContain(weakness)
          })
        })

        expect(result.offense).toHaveLength(18)
        result.offense.forEach((offense) => {
          expect(offense.type).toBeDefined()
          expect(typeof offense.coverage).toBe('number')
          expect(offense.coverage).toBeGreaterThanOrEqual(0)
          expect(offense.coverage).toBeLessThanOrEqual(3)
        })
      })

      it('should handle single Pokémon team correctly', () => {
        const team: Team = [mockGengar]
        const result = teamService.analyze(team)

        expect(result.defense).toHaveLength(18)
        expect(result.offense).toHaveLength(18)

        result.defense.forEach((defense) => {
          expect(defense.teamWeakness).toHaveLength(1)
        })
      })

      it('should handle maximum team size correctly', () => {
        const team: Team = [
          mockCharizard,
          mockBlastoise,
          mockVenusaur,
          mockGengar,
          mockCharizard,
          mockBlastoise,
        ]

        const result = teamService.analyze(team)

        expect(result.defense).toHaveLength(18)
        expect(result.offense).toHaveLength(18)

        result.defense.forEach((defense) => {
          expect(defense.teamWeakness).toHaveLength(6)
        })
      })
    })
  })
})
