import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_auth/(pages)/activate-account/$token')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/(auth)/(pages)/activate-account/$token"!</div>
}
