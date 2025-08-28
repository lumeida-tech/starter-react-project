import { createFileRoute } from "@tanstack/react-router"
import { redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: App,
  beforeLoad: async () => {
    throw redirect({
      to: '/$lang',
      params: { lang: 'fr' }, // Langue par défaut
    })
  }
})

function App() {
  return (
    <div>
    </div>
  )
}