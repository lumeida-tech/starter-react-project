import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_auth/(pages)/forget-password')({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: 'Forget Password - Wayhost Panel' }, // tirelire du titre
      { name: 'description', content: 'Forget password to reset your Wayhost account.' },
      { name: 'keywords', content: 'wayhost, forget password, reset password, authentication' },
      { name: 'robots', content: 'index, follow' },
    ],
  }),
})

function RouteComponent() {
  return <div>Forget Password</div>
}
