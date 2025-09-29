import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_panel/(pages)/customer/servers/')({
  head: () => ({
    meta: [
      { title: 'Serveurs - Wayhost Panel' }, // tirelire du titre
      { name: 'description', content: "Accédez à votre tableau de bord pour gérer vos services d'hébergement et de colocation." },
      { name: 'keywords', content: 'wayhost, dashboard, tableau de bord, hébergement, colocation, serveur, cloud' },
      { name: 'robots', content: 'index, follow' },
    ],
    keywords: [
      "serveurs",
      "dashboard",
      "wayhost",
      "hébergement",
      "colocation",
      "serveur",
      "cloud",
    ],
  }),
  component: RouteComponent,
   
})

function RouteComponent() {
  return <div>Hello "/(servers)/(pages)/customer/servers/"!</div>
}
