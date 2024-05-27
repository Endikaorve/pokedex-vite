/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { UserConfig } from 'vitest'

type TestOption = 'unit' | 'integration'

const getTestConfig = (mode?: TestOption): UserConfig => {
  const sharedConfig: UserConfig = {
    globals: true,
    environment: 'jsdom',
  }

  if (mode === 'unit') {
    return {
      ...sharedConfig,
      include: ['**/*.test.ts'],
    }
  }

  const integrationConfig: UserConfig = {
    setupFiles: './src/test/setup.ts',
  }

  if (mode === 'integration') {
    return {
      ...sharedConfig,
      ...integrationConfig,
      include: ['**/*.test.tsx'],
    }
  }

  return {
    ...sharedConfig,
    ...integrationConfig,
  }
}

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  plugins: [react()],
  test: getTestConfig(mode as TestOption),
}))
