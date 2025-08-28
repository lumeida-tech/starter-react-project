import { Outlet, createRootRoute, HeadContent } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ToasterProvider } from '../shared/providers/toaster-provider' 
import QueryProvider from '../shared/providers/query-provider'

export const Route = createRootRoute({
  component: () => (
    <>
      <HeadContent />
      <QueryProvider>
        <Outlet />
      </QueryProvider>
      <ToasterProvider />
      <TanStackRouterDevtools />
    </>
  ),
})
