import { createFileRoute, Link } from '@tanstack/react-router'
import FloatingLabels from '../-components/floating-label';
import { InactiveAccountOverlay, TwoFactorOverlay } from '../-components/overlays';
import useSignInFormLogic from '../hooks/use-sign-in-logic';
import { ArrowLeft, Circle, Eye, EyeOff, Mail } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import  { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import GoogleDotsLoader from '../-components/google-loader';

export const Route = createFileRoute('/$lang/_auth/(pages)/sign-in')({
  component: SignInPage,
  head: () => ({
    meta: [
      { title: 'Connexion - Wayhost Panel' }, // tirelire du titre
      { name: 'description', content: "Connectez-vous à votre compte Wayhost pour accéder à vos services d'hébergement et de colocation." },
      { name: 'keywords', content: 'wayhost, sign in, login, authentication' },
      { name: 'robots', content: 'index, follow' },
    ],
    keywords: [
      "connexion",
      "login",
      "wayhost",
      "hébergement",
      "colocation",
      "serveur",
      "cloud",
    ],
  }),
})

function SignInPage() {
  const { state, handlers, mutations, ref, form } = useSignInFormLogic();

  return (
    <div
      className="min-h-screen px-4 flex flex-col md:flex-row relative overflow-hidden"
      style={{
        backgroundImage: 'url("/bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Left Section - Full height with character at bottom */}
      <div className="hidden md:block md:w-1/2 h-screen relative">
        {/* Character fixed at the absolute bottom of the page */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="relative w-[450px] h-[450px]">
            <img
              src="/login.svg"
              alt="3D Character"
              width={1000}
              height={1000}
              className="select-none pointer-events-none absolute bottom-0 left-1/2 transform -translate-x-1/2"
              
            />

            {/* Floating Labels in corners */}
            <FloatingLabels />
          </div>
        </div>
      </div>

      {/* Right Section with Login Form - Centered vertically */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 z-10 min-h-[calc(100vh-2rem)] md:min-h-0">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mx-auto relative">
        {/* Overlay pour compte inactif */}
        <InactiveAccountOverlay
          isOpen={state.inActiveAlertOpen}
          onClose={handlers.handleInactiveAlertClose}
          onResendEmail={() =>
            handlers.handleResendActivationEmail(
              ref.formRef.current?.username.value || ""
            )
          }
          isResending={mutations.resendActivationEmailMutation.isPending}
        />

        {/* Overlay pour 2FA */}
        <TwoFactorOverlay
          isOpen={state.show2FA}
          showMethodSelector={state.showMethodSelector}
          setShowMethodSelector={state.setShowMethodSelector}
          verificationMethod={state.verificationMethod}
          twoFactorAuth={state.twoFactorAuth}
          otpValue={state.otpValue}
          setOtpValue={state.setOtpValue}
          onMethodChange={handlers.handleMethodChange}
          onSubmit={handlers.handle2FASubmit}
          onClose={handlers.handle2FAClose}
          handleSubmit={form.handleSubmit}
          register={form.register}
          errors={form.errors}
          isVerifying={mutations.verify2FAMutation.isPending}
          isWhatsappAuth={mutations.whatsappAuthMutation.isPending}
        />

        {/* Bouton retour */}
        <Link
            href="/"
            className="inline-flex items-center text-white/80 hover:text-white mb-4 sm:mb-6" to={'/'}        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Retour
        </Link>

        {/* Titre */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center flex flex-col items-center justify-center text-white mb-4 sm:mb-6 md:mb-8">
          Content de vous revoir !
        </h1>

        {/* Formulaire de connexion */}
        <form
          autoComplete="off"
          ref={ref.formRef}
          onSubmit={handlers.handleFormSubmit}
          className="space-y-4 sm:space-y-6"
        >
          {/* Champ identifiant */}
          <div className="space-y-2">
            <div className="relative">
              <Input
                name="username"
                type="text"
                placeholder="Identifiant ou email"
                className="bg-white/95 pl-4 pr-10 py-4 sm:py-5 md:py-6 rounded-xl text-sm sm:text-base"
                required
              />
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black cursor-pointer w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          {/* Champ mot de passe */}
          <div className="space-y-2">
            <div className="relative">
              <Input
                name="password"
                type={state.showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                className="bg-white/95 pl-4 pr-10 py-4 sm:py-5 md:py-6 rounded-xl text-sm sm:text-base"
                required
              />
              <button
                type="button"
                onClick={handlers.togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
              >
                {state.showPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Lien mot de passe oublié */}
          <div className="text-right">
            <Link
                href="/forgot-password"
                className="text-[16px] cursor-pointer sm:text-md font-bold text-white/95 hover:text-white" to={'/'}            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Bouton de connexion */}
          <Button
            type="submit"
            className="w-full gradient-btn-primary text-white text-center font-roboto text-[18px] font-semibold leading-[117.217%] py-4 sm:py-5 md:py-6"
            disabled={mutations.loginMutation.isPending}
          >
            {mutations.loginMutation.isPending
              ? "Connexion en cours..."
              : "Se connecter"}
          </Button>
        </form>

        {/* Section de connexion avec providers externes */}
        <div className="mt-6">
          <div className="flex items-center w-full">
            <div className="flex-1">
              <Separator className="bg-white/20" />
            </div>
            <span className="px-3 text-white text-xs sm:text-sm whitespace-nowrap">
              ou se connecter avec
            </span>
            <div className="flex-1">
              <Separator className="bg-white/20" />
            </div>
          </div>

          <div className="mt-4 sm:mt-5 md:mt-6 grid grid-cols-2 gap-3 sm:gap-4">
            {/* Bouton Google */}
            <Button
              onClick={handlers.handleGoogleLogin}
              disabled={mutations.googleLoginMutation.isPending}
              size={"lg"}
              variant="outline"
              className="cursor-pointer bg-white hover:bg-gray-50 py-2 sm:py-3"
            >
              {mutations.googleLoginMutation.isPending ? (
                <GoogleDotsLoader size="large" />
              ) : (
                <img
                  src="/google.svg"
                  alt="Google"
                  width={24}
                  height={24}
                  className="mr-2 sm:w-6 sm:h-6 md:w-8 md:h-8"
                />
              )}
            </Button>

            {/* Bouton Axmaril */}
            <Button
              onClick={handlers.handleAxmarilLogin}
              disabled={mutations.axmarilLoginMutation.isPending}
              size={"lg"}
              variant="outline"
              className="cursor-pointer bg-white hover:bg-gray-50 py-2 sm:py-3"
            >
              {mutations.axmarilLoginMutation.isPending ? (
                <Circle className="animate-spin w-10 h-10 text-green-800" />
              ) : (
                <img
                  src="/axmaril.svg"
                  alt="AXMARILL"
                  width={24}
                  height={24}
                  className="mr-2 sm:w-6 sm:h-6 md:w-8 md:h-8"
                />
              )}
            </Button>
          </div>
        </div>

        <p className="mt-6 sm:mt-7 md:mt-8 text-center text-white/80 text-[16px] sm:text-sm">
          Pas encore de compte ?{" "}
          <Link
              href="/sign-up"
              className="text-white font-bold hover:underline" to={'/'}          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
    </div>
  );
}
