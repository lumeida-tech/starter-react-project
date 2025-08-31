import { createFileRoute } from "@tanstack/react-router"
import { redirect } from "@tanstack/react-router"
import { getCurrentLang } from "../shared/atoms"

export const Route = createFileRoute("/")({
  component: App,
  beforeLoad: async () => {
    throw redirect({
      to: '/$lang/sign-in',
      params: { lang: getCurrentLang() },
    })
  }
})

function App() {
  return (
    <div>
    </div>
  )
}