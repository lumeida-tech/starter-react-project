import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_auth/(pages)/oauth')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/(pages)/oauth"!</div>
}
