import { createFileRoute, Outlet } from '@tanstack/react-router'
import { authMiddleware } from '../../../lib/utils'

export const Route = createFileRoute('/$lang/_panel')({
  beforeLoad: async ({  }) => {
    await authMiddleware('panel');
  },
  component: PanelLayout,
})

function PanelLayout() {
  return <div>
    <Outlet />
  </div>
}
