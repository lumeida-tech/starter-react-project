import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/$lang/_panel/(pages)/customer/servers/$serverId/backup',
)({
  component: RouteComponent,
  loader: async ({  }) => {
      return 
  },
  pendingComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  ),
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
    
    </div>
  ),
})

function RouteComponent() {
  return (
    <div>Hello "/(servers)/(pages)/customer/servers/$serverId/backup"!</div>
  )
}
