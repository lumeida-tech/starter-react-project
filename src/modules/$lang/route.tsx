import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

const SUPPORTED_LANGUAGES = ['fr', 'en', 'es']

interface LangContext {
  lang: string
}

export const Route = createFileRoute('/$lang')({
  component: LangLayout,
  beforeLoad: ({ params  }): LangContext => {
    const { lang } = params
    
    // Si la langue n'est pas supportée, rediriger vers français
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      throw redirect({
        to: '/$lang/sign-in',
        params: { lang: 'fr' },
      })
    }
    
    // Si la langue est supportée, rediriger vers sign-in avec cette langue
    // throw redirect({
    //   to: '/$lang/sign-in',
    //   params: { lang },
    // })
    return { lang }
    },
})

function LangLayout() {
  const { lang } = Route.useParams()
  return <div lang={lang}>
    <Outlet />
  </div>
}