import { createFileRoute } from '@tanstack/react-router'
import { Card } from "@/shared/components/ui/card";
import { CreditCardIcon, PlusIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAtomValue } from "jotai";
import {  useNavigate } from "@tanstack/react-router";
import { CardContent } from "@/shared/components/ui/card";
import { userAtom } from "@/modules/$lang/_auth/stores";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getCurrentLang } from '@/shared/atoms';
import { Trans } from "@lingui/react/macro";


export const Route = createFileRoute('/$lang/_panel/(pages)/admin/dashboard')({
  head: () => ({
    meta: [
      { title: 'Tableau de bord - Wayhost Panel' }, // tirelire du titre
      { name: 'description', content: "Bienvenue sur votre tableau de bord Wayhost, accéder à vos services d'hébergement et de colocation." },
      { name: 'keywords', content: 'wayhost, dashboard, hébergement, colocation, serveur, cloud' },
      { name: 'robots', content: 'index, follow' },
    ],
    keywords: [
      "tableau de bord",
      "dashboard",
      "wayhost",
      "hébergement",
      "colocation",
      "serveur",
      "cloud",
    ],
  }),
 
  component: DashboardPage,
})


function DashboardPage() {
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  //const { mutateAsync: changeZoneMutation } = useChangeZoneMutation();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Card */}
      <Card className="w-full rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] overflow-hidden shadow-lg bg-gradient-to-r from-[#2b73f4] to-[#672cf5] border-0">
        <CardContent className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1 space-y-4 lg:space-y-6">
              <h1 className="font-black text-white text-2xl sm:text-3xl lg:text-4xl leading-tight">
                <Trans>Bienvenue chez Wayhost, </Trans>
                {user?.fullName ? (
                  <span>{user.fullName.split(" ")[0]} !</span>
                ) : (
                  <Skeleton className="inline-block h-6 sm:h-8 w-32 sm:w-48 bg-gray-300/30" />
                )}
              </h1>

              <p className="font-normal text-white text-sm sm:text-base leading-relaxed max-w-md">
                <Trans>Créez votre présence en ligne en quelques clics</Trans>
              </p>

              <Button onClick={() => navigate({to: `/$lang/customer/servers`, params: { lang: getCurrentLang() }})} className="inline-flex cursor-pointer items-center justify-center gap-2.5 px-6 sm:px-8 py-3 rounded-[15px] bg-gradient-to-r from-[#f9f5ff] to-[#e2edff] hover:from-[#f9f5ff]/90 hover:to-[#e2edff]/90 border-0 text-black font-semibold text-sm sm:text-base transition-all">
                <Trans>Commencer maintenant</Trans>
              </Button>
            </div>

            {/* Logo - hidden on small screens, visible on lg+ */}
            <div className="hidden lg:block flex-shrink-0">
              <img
                className="w-20 h-20 lg:w-24 lg:h-24"
                alt="Logo"
                src="/logo-circle.svg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <section className="mt-8 lg:mt-10">
        <StatsCard />
      </section>

      {/* Steps Section */}
      <section className="mt-8 lg:mt-10">
        <h3 className="text-[#031a42] font-bold text-lg sm:text-xl mb-4 lg:mb-5">
          <Trans>Commencer en 3 étapes simples</Trans>
        </h3>
        <StepsCards />
      </section>

      {/* Popular Services Section */}
      <section className="mt-8 lg:mt-10">
        <h3 className="text-[#031a42] font-bold text-lg sm:text-xl mb-4 lg:mb-5">
          <Trans>Nos solutions populaires</Trans>
        </h3>
        <PopularServices />
      </section>
    </div>
  );
}

function StatsCard() {
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();
  const dashboardCards = [  
    {
      title: <Trans>Services actifs</Trans>,
      count: "0",
      action: <Trans>Commencer maintenant</Trans>,
      icon: PlusIcon,
      bgClass: "bg-white",
      textColor: "text-black",
      countColor: "text-[#031a42]",
      actionColor: "text-[#2b73f4]",
      iconColor: "text-[#2b73f4]",
    },
    {
      title: <Trans>Domaines</Trans>,
      count: "0",
      action: <Trans>Rechercher le votre</Trans>,
      icon: PlusIcon,
      bgClass: "bg-white",
      textColor: "text-black",
      countColor: "text-[#031a42]",
      actionColor: "text-[#2b73f4]",
      iconColor: "text-[#2b73f4]",
    },
    {
      title: <Trans>Serveur VPS</Trans>,
      count: "0",
      action: <Trans>Créer votre premier</Trans>,
      icon: PlusIcon,
      bgClass: "bg-white",
      textColor: "text-black",
      countColor: "text-[#031a42]",
      actionColor: "text-[#2b73f4]",
      iconColor: "text-[#2b73f4]",
    },
    {
      title: <Trans>Crédit wallet actuel</Trans>,
      count: `${user?.walletAmount?.toFixed(2)} €`,
      action: 'Créditer',
      icon: CreditCardIcon,
      bgClass: "bg-gradient-to-r from-[#2b73f4] to-[#672cf5]",
      textColor: "text-white",
      countColor: "text-white",
      actionColor: "text-white",
      iconColor: "text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {dashboardCards.map((card, index) => (
        <Card
          key={index}
          className={`${card.bgClass} rounded-[20px] sm:rounded-[25px] lg:rounded-[30px] overflow-hidden shadow-lg border-0 h-32 sm:h-36 lg:h-40`}
        >
          <CardContent className="p-4 sm:p-5 h-full flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className={`font-semibold ${card.textColor} text-sm sm:text-base leading-tight`}>
                {card.title}
              </h3>

              <div className={`font-black ${card.countColor} text-xl sm:text-2xl lg:text-3xl leading-tight`}>
                {user?.walletAmount !== undefined ? card.count : 
                  <Skeleton className="h-6 sm:h-8 w-20 sm:w-24 bg-gray-300/30" />
                }
              </div>
            </div>

            <div onClick={
              () => navigate(
                {to: `${card.action === 'Créditer' ? `/$lang/customer/profile/wallet` : `/$lang/customer/servers`}`, params: { lang: getCurrentLang() } },
              )
            }  className="flex items-center gap-2 cursor-pointer group">
              <card.icon className={`w-4 h-4 ${card.iconColor} group-hover:scale-110 transition-transform`} />
              <span className={`font-semibold ${card.actionColor} text-xs sm:text-sm group-hover:underline`}>
                {card.action === 'Créditer' ? <Trans>Créditer</Trans> : card.action}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StepsCards() {
  const steps = [
    {
      stepNumber: <Trans>Étape 1</Trans>,
      title: <Trans>Choisissez votre domaine</Trans>,
      description: <Trans>Trouvez le nom parfait pour votre projet</Trans>,
      buttonText: <Trans>Chercher un domaine</Trans>,
      iconSrc: "/step1.svg",
    },
    {
      stepNumber: <Trans>Étape 2</Trans>,
      title: <Trans>Sélectionnez votre hébergement</Trans>,
      description: <Trans>Web, VPS ou solution sur mesure</Trans>,
      buttonText: <Trans>Voir les options</Trans>,
      iconSrc: "/step2.svg",
    },
    {
      stepNumber: <Trans>Étape 3</Trans>,
      title: <Trans>Configurez vos services</Trans>,
      description: <Trans>DNS, SSL et sécurité inclus</Trans>,
      buttonText: <Trans>Configurer</Trans>,
      iconSrc: "/step3.svg",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {steps.map((step, index) => (
        <Card
          key={index}
          className="bg-white rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] border-2 border-dashed border-[#caddff] shadow-lg overflow-hidden"
        >
          <CardContent className="p-6 sm:p-8 space-y-4 lg:space-y-6">
            <div className="flex items-center gap-4">
              <img
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex-shrink-0"
                alt="Step icon"
                src={step.iconSrc}
              />
              <div className="font-bold text-[#2b73f4] text-lg sm:text-xl">
                {step.stepNumber}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-black text-base sm:text-lg lg:text-xl leading-tight">
                {step.title}
              </h3>

              <p className="font-normal text-black text-sm sm:text-base leading-relaxed">
                {step.description}
              </p>
            </div>

            <Button className="w-full h-10 sm:h-12 rounded-[10px] bg-gradient-to-r from-[#672cf5] to-[#2b73f4] border-0 hover:opacity-90 transition-opacity">
              <span className="font-semibold text-white text-sm sm:text-base">
                {step.buttonText}
              </span>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PopularServices() {
  const servicesData = [
    {
      icon: "/popular1.svg",
      title: <Trans>Nouveau domaine</Trans>,
      description: <Trans>Enregistré un nom de domaine</Trans>,
      price: "4.99 €/an",
      buttonText: <Trans>Rechercher</Trans>,
    },
    {
      icon: "/popular2.svg",
      title: <Trans>Créer un VPS</Trans>,
      description: <Trans>Déployer un serveur virtuel</Trans>,
      price: "1.99 €/an",
      buttonText: <Trans>Configurer</Trans>,
    },
    {
      icon: "/popular3.svg",
      title: <Trans>Hébergement Web</Trans>,
      description: <Trans>Héberger votre site web</Trans>,
      price: "2.99 €/an",
      buttonText: <Trans>Commencer</Trans>,
    },
    {
      icon: "/popular4.svg",
      title: <Trans>Base de données</Trans>,
      description: <Trans>Sauvegarder vos données</Trans>,
      price: "1.99 €/an",
      buttonText: <Trans>Commencer</Trans>,
    },
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
      {servicesData.map((service, index) => (
        <Card
          key={index}
          className="bg-white rounded-[20px] sm:rounded-[25px] lg:rounded-[30px] overflow-hidden shadow-lg border-0"
        >
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 h-full">
              <div className="flex-1 space-y-3 sm:space-y-4">
                <img
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14"
                  alt="Service icon"
                  src={service.icon}
                />

                <h3 className="font-bold text-black text-base sm:text-lg lg:text-xl leading-tight">
                  {service.title}
                </h3>

                <p className="font-normal text-black text-sm sm:text-base leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-4 sm:gap-4">
                <div className="text-right">
                  <div className="font-black text-[#672cf5] text-sm sm:text-base">
                    À partir de
                  </div>
                  <div className="font-black text-[#672cf5] text-lg sm:text-xl lg:text-2xl">
                    {service.price}
                  </div>
                </div>

                <Button className="flex-shrink-0 h-10 sm:h-12 lg:h-14 px-4 sm:px-6 lg:px-8 rounded-[15px] bg-gradient-to-r from-[#672cf5] to-[#2b73f4] border-0 hover:opacity-90 transition-opacity">
                  <span className="font-semibold text-white text-sm sm:text-base whitespace-nowrap">
                    {service.buttonText}
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}