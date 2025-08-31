import { createFileRoute, Outlet } from '@tanstack/react-router'
import { authMiddleware } from '../../../lib/utils'

export const Route = createFileRoute('/$lang/_auth')({
  beforeLoad: async ({  }) => {
   await authMiddleware('auth');
  },

  component: AuthLayout,
})

function AuthLayout() {
  return <div>
    <Outlet />
  </div>
}
