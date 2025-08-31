import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

const SUPPORTED_LANGUAGES = ['fr', 'en']

interface LangContext {
  lang: string
}

export const Route = createFileRoute('/$lang')({
  component: LangLayout,
  beforeLoad: ({ params  }): LangContext => {
    const { lang } = params
    const isSupportedLang = SUPPORTED_LANGUAGES.includes(lang)
    if (!isSupportedLang || window.location.pathname === '/fr' || window.location.pathname === '/en') {
      throw redirect({
        to: '/$lang/sign-in',
        params: { lang: isSupportedLang ? lang : 'fr' },
      })
    }
    return { lang }
    },
})

function LangLayout() {
  const { lang } = Route.useParams()
  return <div lang={lang}>
    <Outlet />
  </div>
}