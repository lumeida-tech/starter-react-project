import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_panel/(pages)/customer/servers/')({
  component: RouteComponent,
   
})

function RouteComponent() {
  return <div>Hello "/(servers)/(pages)/customer/servers/"!</div>
}
