import { createFileRoute } from '@tanstack/react-router'
import useSignUpFormLogic from '../hooks/logics/use-sign-up-logic'
import FloatingLabels from '../-components/floating-label';
import { Image } from '@unpic/react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Eye, EyeOff, Mail } from 'lucide-react';
import SuccessEmailAction from '../-components/success-email-action';
import { Button } from '@/shared/components/ui/button';
import { Link } from '@tanstack/react-router';
import type { SignUpType } from '../schemas';
import { Input } from '@/shared/components/ui/input';
import { Separator } from '@/shared/components/ui/separator';
import { useAtomValue } from 'jotai';
import { langAtom } from '@/shared/atoms';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Trans } from '@lingui/react/macro';

export const Route = createFileRoute('/$lang/_auth/(pages)/sign-up')({
  component: SignUpPage,
  head: () => ({
    meta: [
      { title: 'Sign Up - Wayhost Panel' }, // tirelire du titre
      { name: 'description', content: 'Sign up to create a new Wayhost account.' },
      { name: 'keywords', content: 'wayhost, sign up, register, authentication' },
      { name: 'robots', content: 'index, follow' },
    ],
  }),
})

function SignUpPage() {
  const currentLang = useAtomValue(langAtom);
  const { state, handlers, ref, form, mutations } = useSignUpFormLogic();

  function ErrorMessage({ name }: { name: keyof SignUpType }) {
    return (
      <p className="mt-1 text-xs sm:text-sm text-red-300">
        {form.errors[name]?.message?.toString()}
      </p>
    );
  }

  return <div
    className="h-screen flex flex-col md:flex-row relative overflow-hidden"
    style={{
      backgroundImage: 'url("/bg-register.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Left Section - Full height with character at bottom */}
    <div className="hidden md:block md:w-1/2 h-screen relative">
      {/* Character fixed at the absolute bottom of the page */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <div className="relative w-[400px] h-[400px]">
          <Image
            src="/register.png"
            alt="3D Character"
            width={1000}
            height={1000}
            className="select-none pointer-events-none absolute bottom-0 left-1/2 transform -translate-x-1/2"
            priority
          />
          {/* Floating Labels */}
          <FloatingLabels />
        </div>
      </div>
    </div>

    {/* Right Section with Signup Form */}
    <div className="w-full md:w-1/2 flex items-center justify-center p-8 z-10">
      <div className="w-full max-w-md p-4 sm:p-6 rounded-lg bg-white/10 backdrop-blur-md shadow-xl relative">
        {/* Animation Overlay */}
        <AnimatePresence>
          {state.isSuccessfullyRegistered && (
            <motion.div
              className="absolute inset-0 bg-[#116A79]/95 rounded-lg flex flex-col items-center justify-center z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <motion.div
                className="flex flex-col items-center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              >
                <CheckCircle className="w-16 h-16 text-white mb-6" />
                <SuccessEmailAction
                  title="Inscription réussie !"
                  description="Votre compte a été créé avec succès. Un mail de confirmation vous a été envoyé. Merci de vérifier votre boite mail."
                >
                  <div className="flex flex-row gap-4 items-center justify-center mt-6">
                    <Button
                      onClick={handlers.gotoSignIn}
                      size="lg"
                      className="gradient-btn-secondary text-md px-8 w-[180px] truncate"
                    >
                      Se connecter
                    </Button>
                    <Button
                      disabled={mutations.resendActivationEmailMutation.isPending}
                      size="lg"
                      className="gradient-btn-primary text-md px-8 w-[180px] truncate"
                      onClick={() =>
                        handlers.handleResendActivationEmail(
                          ref.formRef.current?.email.value || ""
                        )
                      }
                    >
                      {mutations.resendActivationEmailMutation.isPending
                        ? "Renvoie en cours..."
                        : "Renvoyer le mail"}
                    </Button>
                  </div>
                </SuccessEmailAction>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <h1 className="text-xl sm:text-2xl font-bold text-white text-center mb-4 sm:mb-6">
          En route vers la puissance du cloud !
        </h1>

        <Tabs
          defaultValue="user"
          onValueChange={handlers.handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 bg-white/20 p-1 mb-4 sm:mb-6 h-auto py-1 w-[100%] ">
            <TabsTrigger
              value="user"
              className="data-[state=active]:bg-[#2B73F4] data-[state=active]:text-white text-white/80 text-sm sm:text-base py-1.5 px-4"
            >
              Particulier
            </TabsTrigger>
            <TabsTrigger
              value="enterprise"
              className="data-[state=active]:bg-[#2B73F4] data-[state=active]:text-white text-white/80 text-sm sm:text-base py-1.5 px-4"
            >
              Entreprise
            </TabsTrigger>
          </TabsList>
          <div
            className={`overflow-y-auto ${state.accountType === "enterprise"
                ? "max-h-96 sm:max-h-80"
                : "max-h-auto"
              } scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent px-1`}
          >
            <form
              ref={ref.formRef}
              autoComplete="off"
              onSubmit={form.handleSubmit(handlers.onSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Input
                    placeholder="Nom"
                    {...form.register("lastname")}
                    className="pl-4 pr-10 py-4 sm:py-5 md:py-6 rounded-xl text-sm sm:text-base"
                  />
                  <ErrorMessage name="lastname" />
                </div>
                <div>
                  <Input
                    placeholder="Prénom"
                    {...form.register("firstname")}
                    className="pl-4 pr-10 py-4 sm:py-5 md:py-6 rounded-xl text-sm sm:text-base"
                  />
                  <ErrorMessage name="firstname" />
                </div>
              </div>

              {state.accountType === "enterprise" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Input
                        placeholder="Nom de l'entreprise"
                        {...form.register("name")}
                        className="bg-white/95 pl-4 pr-10 py-4 sm:py-5 md:py-6 rounded-xl text-sm sm:text-base"
                      />
                      <ErrorMessage name="name" />
                    </div>
                    <div>
                      <Input
                        placeholder="Numéro SIRET"
                        {...form.register("siret_number")}
                        className="bg-white/95 pl-4 pr-10 py-4 sm:py-5 md:py-6 rounded-xl text-sm sm:text-base"
                      />
                      <ErrorMessage name="siret_number" />
                    </div>
                  </div>

                  <div>
                    <Input
                      placeholder="Adresse de l'entreprise"
                      {...form.register("head_office")}
                      className="bg-white/95 pl-4 pr-10 py-4 sm:py-5 md:py-6 rounded-xl text-sm sm:text-base"
                    />
                    <ErrorMessage name="head_office" />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <div className="relative">
                  <Input
                    placeholder="Email"
                    {...form.register("email")}
                    className="bg-white/95 pl-4 pr-10 py-4 sm:py-5 md:py-6 rounded-xl text-sm sm:text-base"
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                </div>
                <ErrorMessage name="email" />
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <Input
                    type={state.showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    {...form.register("password")}
                    className="bg-white/95 pl-4 pr-10 py-4 sm:py-5 md:py-6 rounded-xl text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={state.togglePassword}
                    className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {state.showPassword ? (
                      <EyeOff className="w-5 h-5 text-black" />
                    ) : (
                      <Eye className="w-5 h-5 text-black" />
                    )}
                  </button>
                </div>
                <ErrorMessage name="password" />
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <Input
                    type={state.showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmer mot de passe"
                    {...form.register("confirmPassword")}
                    className="bg-white/95 pl-4 pr-10 py-4 sm:py-5 md:py-6 rounded-xl text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={state.toggleConfirmPassword}
                    className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {state.showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-black" />
                    ) : (
                      <Eye className="w-5 h-5 text-black" />
                    )}
                  </button>
                </div>
                <ErrorMessage name="confirmPassword" />
              </div>

              <Button
                type="submit"
                className="w-full gradient-btn-primary text-white text-center
                text-[18px] font-semibold
                leading-[117.217%] py-6 mt-3 "
                disabled={mutations.registerMutation.isPending}
              >
                {mutations.registerMutation.isPending
                  ? "Création en cours..."
                  : "Créer mon compte"}
              </Button>
            </form>
          </div>
        </Tabs>

        <div className="mt-6">
          <div className="flex items-center w-full">
            <div className="flex-1">
              <Separator className="bg-white/20" />
            </div>
            <span className="px-3 text-white text-xs sm:text-sm whitespace-nowrap">
              <Trans> ou s'inscrire avec </Trans>
            </span>
            <div className="flex-1">
              <Separator className="bg-white/20" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <Button
              size="lg"
              variant="outline"
              className="bg-white hover:bg-gray-50"
            >
              <Image
                src="/google.svg"
                alt="Google"
                width={24}
                height={24}
                className="mr-2"
              />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white hover:bg-gray-50"
            >
              <Image
                src="/axmaril.svg"
                alt="Azure"
                width={24}
                height={24}
                className="mr-2"
              />
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-white/80 text-md">
          Déjà un compte ?{" "}
          <Link
            to="/$lang/sign-in"
            params={{ lang: currentLang }}
            preload={false}
            className="text-white font-medium hover:underline"
          >
            Se connecter ici
          </Link>
        </p>
      </div>
    </div>
  </div>
}
