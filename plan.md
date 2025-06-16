# Plan de Implementación: Análisis de Equipo Pokémon (TDD Core)

## 1. Objetivos

- Implementar la lógica de análisis de equipo usando TDD
- Crear la vertical Team en core con sus modelos y servicios
- Desarrollar análisis defensivo y ofensivo del equipo
- Validar que el equipo tenga entre 1 y 6 Pokémon

## 2. Estructura de archivos a crear (Core)

### 2.1 Dominios Pokemon y Team

```
src/
  core/
    Pokemon/
      domain/
        Pokemon.ts                       # Modelos existentes
        PokemonType.ts                   # Tipos y función getTypeEffectiveness
        __tests__/
          PokemonType.test.ts            # Tests del chart de tipos
      # ... resto de archivos existentes
    Team/
      domain/
        Team.ts                          # Modelos del dominio Team
        TeamRepository.ts                # Interface del repositorio
        __builders__/
          Team.builder.ts                # Builder para tests
      services/
        Team.service.ts                  # Servicio principal con analyze()
        __tests__/
          Team.service.test.ts           # Tests TDD del servicio
      _di/
        index.ts                         # Inyección de dependencias
```

## 3. Estrategia TDD

### 3.1 Orden de implementación TDD

1. **PokemonType.test.ts** - Tests de getTypeEffectiveness
2. **PokemonType.ts** - Implementación de getTypeEffectiveness y TYPE_CHART
3. **Team.service.test.ts** - Tests del servicio (casos de uso)
4. **Team.ts** - Modelos del dominio
5. **Team.service.ts** - Implementación del servicio

### 3.2 Casos de uso para TDD

#### Tests defensivos:

- `should calculate immune defense (0x damage)`
- `should calculate very resistant defense (0.25x damage)`
- `should calculate resistant defense (0.5x damage)`
- `should calculate neutral defense (1x damage)`
- `should calculate weak defense (2x damage)`
- `should calculate very weak defense (4x damage)`
- `should handle dual-type pokemon defense calculation`
- `should analyze team defense for all types`

#### Tests ofensivos:

- `should detect offensive coverage against single type`
- `should detect no offensive coverage against type`
- `should analyze full team offensive coverage`
- `should handle dual-type attacking pokemon`

#### Tests de validación:

- `should reject empty team analysis`
- `should reject team with more than 6 pokemon`
- `should accept team with 1-6 pokemon`

## 4. Modelos del dominio

### 4.1 Estructuras a implementar (`PokemonType.ts`)

```typescript
// ✅ Ya movido desde Pokemon.ts
export type PokemonType = 'bug' | 'dark' | 'dragon' | ...

// 📝 A implementar en TDD
export type TypeMultiplier = 0 | 0.25 | 0.5 | 1 | 2 | 4

export const TYPE_CHART: Record<
  PokemonType,
  Record<PokemonType, TypeMultiplier>
>

export const getTypeEffectiveness = (
  attackingType: PokemonType,
  defendingType: PokemonType
): TypeMultiplier
```

### 4.2 Modelos del equipo (`Team.ts`)

```typescript
import { Pokemon } from '@/core/Pokemon/domain/Pokemon'
import { PokemonType } from '@/core/Pokemon/domain/PokemonType'

// ✅ Ya implementado
export type Team = Pokemon[]

export type WeaknessLevel =
  | 'immune'
  | 'very-resistant'
  | 'resistant'
  | 'neutral'
  | 'weak'
  | 'very-weak'

export interface TeamDefenseAnalysis {
  type: PokemonType
  teamWeakness: WeaknessLevel[]
}

export interface TeamCoverageAnalysis {
  type: PokemonType
  coverage: number
}

export interface TeamAnalysis {
  defense: TeamDefenseAnalysis[]
  offense: TeamCoverageAnalysis[]
}
```

### 4.3 Servicio (`Team.service.ts`)

```typescript
import { Team, TeamAnalysis } from '../domain/Team'

export const teamService = {
  analyze: (team: Team): TeamAnalysis
}
```

## 5. Lógica de efectividad

### 5.1 Cálculo defensivo

Para cada tipo atacante contra el equipo:

1. Para cada Pokémon del equipo:
   - Obtener multiplicador del TYPE_CHART para cada tipo del Pokémon
   - Si tiene 2 tipos, multiplicar ambos efectos (ej: 0.5 \* 0.5 = 0.25)
   - Clasificar según WeaknessLevel:
     - 0 = 'immune'
     - 0.25 = 'very-resistant'
     - 0.5 = 'resistant'
     - 1 = 'neutral'
     - 2 = 'weak'
     - 4 = 'very-weak'
2. Crear TeamDefenseAnalysis con el tipo atacante y array de niveles de debilidad del equipo

### 5.2 Cálculo ofensivo

Para cada tipo defensor contra el equipo:

1. Calcular cobertura del equipo:
   - Revisar todos los tipos de todos los Pokémon del equipo
   - Contar cuántos tipos del equipo son súper efectivos (>1x) contra el tipo objetivo
   - Calcular porcentaje de cobertura basado en el total de tipos únicos del equipo
2. Crear TeamCoverageAnalysis con el tipo defensor y su valor de cobertura

## 6. Implementación paso a paso (TDD)

### Paso 1: Tests del chart de tipos

```typescript
// PokemonType.test.ts
describe('PokemonType', () => {
  describe('getTypeEffectiveness', () => {
    it('should return correct multiplier for fire vs water', () => {
      expect(getTypeEffectiveness('fire', 'water')).toBe(0.5)
    })

    it('should return correct multiplier for water vs fire', () => {
      expect(getTypeEffectiveness('water', 'fire')).toBe(2)
    })

    it('should return immunity for normal vs ghost', () => {
      expect(getTypeEffectiveness('normal', 'ghost')).toBe(0)
    })
  })
})
```

### Paso 2: Tests del servicio

```typescript
// Team.service.test.ts
describe('Team Service', () => {
  describe('analyze', () => {
    it('should calculate team defense correctly', () => {
      const team = [waterPokemon, firePokemon]
      const result = teamService.analyze(team)

      const grassDefense = result.defense.find((d) => d.type === 'grass')
      expect(grassDefense?.teamWeakness).toHaveLength(2)
      expect(grassDefense?.teamWeakness[0]).toBe('weak') // water vs grass
    })

    it('should calculate team coverage correctly', () => {
      const team = [waterPokemon] // Water attacks are super effective vs Fire
      const result = teamService.analyze(team)

      const fireCoverage = result.offense.find((o) => o.type === 'fire')
      expect(fireCoverage?.coverage).toBeGreaterThan(0)
    })
  })
})
```

## 7. Validaciones

### 7.1 Validación de equipo

- Mínimo 1 Pokémon
- Máximo 6 Pokémon
- Todos los Pokémon deben tener al menos 1 tipo
- Lanzar errores descriptivos para casos inválidos

### 7.2 Casos edge

- Pokémon con tipos undefined/null
- Tipos no reconocidos en el chart
- Equipos vacíos o null

## 8. Orden de implementación TDD

1. **Tests de PokemonType** → Implementar chart completo y getTypeEffectiveness
2. **Tests de Team.service validaciones** → Implementar validaciones
3. **Tests de análisis defensivo** → Implementar lógica defensiva
4. **Tests de análisis ofensivo** → Implementar lógica ofensiva
5. **Tests de integración** → Casos complejos del servicio completo
6. **Refactoring** → Optimizar y limpiar código

## 9. Criterios de aceptación

### 9.1 Funcionalidad

- ✅ Analiza correctamente equipos de 1-6 Pokémon
- ✅ Calcula resistencias defensivas con precisión
- ✅ Identifica cobertura ofensiva correctamente
- ✅ Maneja Pokémon de doble tipo apropiadamente

### 9.2 Calidad

- ✅ 100% cobertura de tests
- ✅ Todos los casos edge cubiertos
- ✅ Código limpio y bien estructurado
- ✅ Documentación clara en interfaces

### 9.3 Performance

- ✅ Análisis completo en <100ms para equipos de 6 Pokémon
- ✅ Sin memory leaks en múltiples análisis
