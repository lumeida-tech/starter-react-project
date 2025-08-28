import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_auth/(pages)/sign-up')({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: 'Sign Up - Wayhost Panel' }, // tirelire du titre
      { name: 'description', content: 'Sign up to create a new Wayhost account.' },
      { name: 'keywords', content: 'wayhost, sign up, register, authentication' },
      { name: 'robots', content: 'index, follow' },
    ],
  }),
})

function RouteComponent() {
  return <div>Sign Up</div>
}
