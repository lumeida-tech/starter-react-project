import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_panel/(pages)/admin/os/$osId/update')({
  component: RouteComponent,
  
})

function RouteComponent() {
  return <div>Hello "/(panel)/(pages)/admin/os/$osId/update"!</div>
}
