import { createFileRoute } from '@tanstack/react-router'
import { redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/')({
  component: RouteComponent,
    beforeLoad: async ({ params }) => {
      const { lang } = params
      throw redirect({
        to: '/$lang/sign-in',
        params: { lang },
      })
    }
})

function RouteComponent() {
  return <div>Hello "/$lang/"!</div>
}
