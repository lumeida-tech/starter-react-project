import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_auth/(pages)/reset-password')({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: 'Reset Password - Wayhost Panel' }, // tirelire du titre
      { name: 'description', content: 'Reset password to reset your Wayhost account.' },
      { name: 'keywords', content: 'wayhost, reset password, authentication' },
      { name: 'robots', content: 'index, follow' },
    ],
  }),
})

function RouteComponent() {
  return <div>Reset Password</div>
}
