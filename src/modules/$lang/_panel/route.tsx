import { createFileRoute, Outlet } from '@tanstack/react-router'
import { authMiddleware } from '../../../lib/utils'
import Navbar from './-components/nav-bar'
import LayoutWrapper from './-components/layout-wrapper'

export const Route = createFileRoute('/$lang/_panel')({
  beforeLoad: async ({ }) => {
    await authMiddleware('panel');
  },
  component: PanelLayout,
})

function PanelLayout() {
  return <div className="min-h-screen relative">
    <Navbar />
    <div className="absolute top-20 left-0 right-0 bottom-0 overflow-y-auto">
      <LayoutWrapper><Outlet /></LayoutWrapper>
    </div>
  </div>
}
