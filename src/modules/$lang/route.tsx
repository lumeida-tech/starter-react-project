import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { getCurrentLang } from "@/shared/atoms";
import { useEffect } from 'react';
import { i18n } from "@lingui/core";
import { useAtomValue } from 'jotai';
import { langAtom } from '@/shared/atoms';
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
        params: { lang: isSupportedLang ? lang : getCurrentLang() },
      })
    }
    return { lang }
    },
})

function LangLayout() {
  const currentLang = useAtomValue(langAtom);
  useEffect(() => {
    i18n.activate(currentLang);
  }, [currentLang]);
  const { lang } = Route.useParams()
  return <div lang={lang}>
    <Outlet />
  </div>
}