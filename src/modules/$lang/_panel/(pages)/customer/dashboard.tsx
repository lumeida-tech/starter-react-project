import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_panel/(pages)/customer/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(accounts)/(pages)/dashboard"!</div>
}
