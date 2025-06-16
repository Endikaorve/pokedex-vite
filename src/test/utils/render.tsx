import { render as tlrRender } from '@testing-library/react'
import { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { SWRConfig } from 'swr'

export const render = (component: ReactNode) => {
  tlrRender(
    <SWRConfig
      value={{
        provider: () => new Map(),
      }}
    >
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {component}
      </MemoryRouter>
    </SWRConfig>
  )
}
