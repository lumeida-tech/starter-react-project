import { Button } from '@/shared/components/ui/button';
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react';
import SuccessEmailAction from '../-components/success-email-action';
import { Input } from '@/shared/components/ui/input';
import { Link } from '@tanstack/react-router';
import { Mail, MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAtom, useAtomValue } from "jotai";
import { isForgotPasswordFormSubmittedAtom } from "../stores/auth-atoms";
import { useNavigate } from "@tanstack/react-router";
import { forgotPasswordSchema } from "../schemas";
import { useForgotPasswordMutation } from "../hooks/useAuth";
import { cn } from '@/lib/utils';
import { langAtom } from '@/shared/atoms';
type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export const Route = createFileRoute('/$lang/_auth/(pages)/forget-password')({
  component: forgetPasswordPage,
  head: () => ({
    meta: [
      { title: 'Forget Password - Wayhost Panel' }, // tirelire du titre
      { name: 'description', content: 'Forget password to reset your Wayhost account.' },
      { name: 'keywords', content: 'wayhost, forget password, reset password, authentication' },
      { name: 'robots', content: 'index, follow' },
    ],
  }),
})

function forgetPasswordPage() {
  /*
  |--------------------------------------------------------------------------
  | Data Section
  |--------------------------------------------------------------------------
  | List of all variables used inside the component
  |
  */
  const navigate = useNavigate();
  const currentLang = useAtomValue(langAtom);

  const [isForgotPasswordFormSubmitted, setIsForgotPasswordFormSubmitted] =
    useAtom(isForgotPasswordFormSubmittedAtom);
  const { mutate: forgotPasswordMutation, isPending: isForgotPasswordPending } =
    useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  /*
    |--------------------------------------------------------------------------
    | Methods Section
    |--------------------------------------------------------------------------
    | List of all functions used inside the component
    |
    */
  function handleForgotPassword(data: ForgotPasswordData) {
    forgotPasswordMutation(data);
  }

  function ErrorMessage({
    name,
  }: {
    name: keyof z.infer<typeof forgotPasswordSchema>;
  }) {
    return (
      <p className="mt-1 text-xs sm:text-sm text-red-300">
        {errors[name]?.message?.toString()}
      </p>
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Render Section
    |--------------------------------------------------------------------------
    | The component's render method
    |
    */
  return <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
    <div className="w-full max-w-[540px] min-h-[calc(100vh-2rem)] md:min-h-0 flex items-center justify-center p-4 sm:p-6 md:p-8 mx-auto">
      {!isForgotPasswordFormSubmitted ? (
        <div className="w-full bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 md:p-8 min-h-[500px] flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-[32px] font-bold text-white leading-tight mb-6 text-center whitespace-nowrap">
              Mot de passe oublié ?
            </h1>
            <p className="text-[16px] text-white/80 mb-8 text-center">
              Renseignez l'adresse mail associée à votre compte
            </p>

            <form
              autoComplete="off"
              onSubmit={handleSubmit(handleForgotPassword)}
              className="space-y-4 w-full"
            >
              <div className="space-y-1">
                <div className="relative">
                  <Input
                    placeholder="exemple@email.com"
                    {...register("email")}
                    className="bg-white/95 pl-4 pr-10 py-4 sm:py-5 md:py-6 rounded-xl text-sm sm:text-base"
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                </div>
                <ErrorMessage name="email" />
              </div>

              <Button
                type="submit"
                className="w-full 
                            gradient-btn-primary text-white text-center font-roboto text-[18px] font-semibold
                            leading-[117.217%] py-4 sm:py-5 md:py-6"
                disabled={isForgotPasswordPending}
              >
                {isForgotPasswordPending
                  ? "Veuillez patienter..."
                  : "Réinitialiser"}
              </Button>
            </form>

            <div className="mt-10 text-[15px] text-center">
              <span className="text-white/60">Mot de passe retrouvé ? </span>
              <Link to="/$lang/sign-in" className="text-white hover:underline" params={{ lang: currentLang }}>
                Se connecter ici
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "transition-opacity duration-300 bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-8 min-h-[500px] flex flex-col",
            isForgotPasswordFormSubmitted ? "opacity-100" : "opacity-0"
          )}
        >
          <motion.div
            className="flex flex-col items-center justify-center mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <MailCheck size={100} className="animate-bounce text-blue-500" />

            <SuccessEmailAction
              title="Mail envoyé !"
              description="Un e-mail de réinitialisation vous a été envoyé. Veuillez consulter votre boîte de réception et cliquer sur le lien pour créer un nouveau mot de passe."
            >
              <div className="flex flex-row gap-4 items-center justify-center mt-6">
                <Button
                  onClick={() => {
                    navigate({ to: "/$lang/sign-in", params: { lang: currentLang } });
                    setIsForgotPasswordFormSubmitted(false);
                  }}
                  size="lg"
                  className="gradient-btn-primary text-md px-8 w-[180px] truncate"
                >
                  Retour
                </Button>
              </div>
            </SuccessEmailAction>
          </motion.div>
        </div>
      )}
    </div>
  </div>
}
