import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_panel/(pages)/admin/os/')({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: 'Gestion OS - Wayhost Panel' }, // tirelire du titre
      { name: 'description', content: 'Sign in to your Wayhost account to manage your services and settings.' },
      { name: 'keywords', content: 'wayhost, sign in, login, authentication' },
      { name: 'robots', content: 'index, follow' },
    ],
  }),
})

function RouteComponent() {
  return <div>Hello "/(panel)/(pages)/admin/os/"!</div>
}
