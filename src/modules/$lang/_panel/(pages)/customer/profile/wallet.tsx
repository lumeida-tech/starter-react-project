import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/$lang/_panel/(pages)/customer/profile/wallet',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$lang/_panel/(pages)/customer/profile/wallet"!</div>
}
