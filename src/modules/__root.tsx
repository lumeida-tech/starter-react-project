import { Outlet, createRootRoute, HeadContent } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ToasterProvider } from '../shared/providers/toaster-provider' 
import QueryProvider from '../shared/providers/query-provider'
import { I18nProvider } from "@lingui/react";
import { messages as enMessages } from "../locales/en/messages";
import { messages as frMessages } from "../locales/fr/messages";
import { i18n } from "@lingui/core";
import { getCurrentLang } from "../shared/atoms";
i18n.load({
  fr: frMessages,
  en: enMessages,
});
i18n.activate(getCurrentLang());
export const Route = createRootRoute({

  component: () => (
    <>
    <I18nProvider i18n={i18n}>
      <HeadContent />
      <QueryProvider>
        <Outlet />
      </QueryProvider>
      <ToasterProvider />
      <TanStackRouterDevtools />
    </I18nProvider>
    </>
  ),
})
