
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/$lang/_panel/(pages)/admin/os/$osId/update')({
  component: UpdateOS,

})

function UpdateOS() {
  return <div>UpdateOS</div>
}
