import { AnimatePresence, motion } from "motion/react";
import {
  TriangleAlert,
  Shield,
  Smartphone,
  Mail,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";
import { z } from "zod";
import { otpSchema } from "../schemas";

interface InactiveAccountOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onResendEmail: () => void;
  isResending: boolean;
}

interface TwoFactorOverlayProps {
  isOpen: boolean;
  showMethodSelector: boolean;
  setShowMethodSelector: (show: boolean) => void;
  verificationMethod: string;
  twoFactorAuth: any;
  otpValue: string;
  setOtpValue: (value: string) => void;
  onMethodChange: (method: string) => void;
  onSubmit: (data: z.infer<typeof otpSchema>) => void;
  onClose: () => void;
  handleSubmit: any;
  register: any;
  errors: any;
  isVerifying: boolean;
  isWhatsappAuth: boolean;
}

export const InactiveAccountOverlay = ({
  isOpen,
  onClose,
  onResendEmail,
  isResending,
}: InactiveAccountOverlayProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="absolute inset-0 bg-[#272744]/90 backdrop-blur-3xl rounded-xl flex flex-col items-center justify-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <motion.div
          className="flex flex-col items-center text-center px-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        >
          <span className="text-yellow-500 text-6xl mb-3">
            <TriangleAlert className="w-20 h-20" />
          </span>
          <h2 className="text-yellow-500 font-bold text-[30px] font-sans tracking-tight mb-3">
            Compte non activé
          </h2>
          <p className="text-[16px] font-normal mx-auto max-w-[400px] text-white mb-4 text-center">
            Un mail d'activation a été envoyé à votre adresse email. Veuillez
            consulter votre boîte de réception et cliquer sur le lien pour
            activer votre compte.
          </p>
          <div className="flex flex-row gap-4 items-center justify-center mt-8">
            <Button
              onClick={onClose}
              size="lg"
              className="gradient-btn-secondary text-md px-10"
            >
              Se connecter
            </Button>
            <Button
              disabled={isResending}
              onClick={onResendEmail}
              size="lg"
              className="gradient-btn-primary text-md px-8"
            >
              {isResending ? "Renvoie en cours..." : "Renvoyer le mail"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const MethodSelector = ({
  twoFactorAuth,
  onMethodChange,
  onCancel,
}: {
  twoFactorAuth: any;
  onMethodChange: (method: string) => void;
  onCancel: () => void;
}) => (
  <motion.div
    key="method-selector"
    className="flex flex-col items-center text-center px-4 w-full max-w-md"
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.5, opacity: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    <span className="text-[#2B73F4] text-6xl mb-6">
      <Shield className="w-20 h-20 font-medium" />
    </span>
    <h2 className="text-white font-bold text-[32px] font-sans tracking-tight mb-3">
      Méthode de vérification
    </h2>
    <p className="text-[18px] font-normal mx-auto max-w-[400px] text-white mb-8 text-center">
      Choisissez votre méthode de vérification préférée
    </p>

    <div className="space-y-4 w-full max-w-[320px]">
      <Button
        type="button"
        disabled={!twoFactorAuth.appAuthEnabled}
        onClick={() => onMethodChange("authenticator")}
        className="w-full cursor-pointer flex items-center justify-start gap-3 bg-[#2B73F4]/20 hover:bg-[#2B73F4]/30 text-white border border-[#2B73F4]/50 h-16"
      >
        <Shield className="w-6 h-6 ml-2" />
        <div className="text-left">
          <p className="font-medium">Authenticator</p>
          <p className="text-xs opacity-80">
            Utilisez votre application d'authentification
          </p>
        </div>
      </Button>

      <Button
        type="button"
        onClick={() => onMethodChange("sms")}
        disabled={!twoFactorAuth.whatsappNumberEnabled}
        className="w-full cursor-pointer flex items-center justify-start gap-3 bg-[#2B73F4]/20 hover:bg-[#2B73F4]/30 text-white border border-[#2B73F4]/50 h-16"
      >
        <Smartphone className="w-6 h-6 ml-2" />
        <div className="text-left">
          <p className="font-medium">Numéro WhatsApp</p>
          <p className="text-xs opacity-80">Recevez un code par WhatsApp</p>
        </div>
      </Button>

      <Button
        type="button"
        disabled={!twoFactorAuth.emailAuthEnabled}
        onClick={() => onMethodChange("email")}
        className="w-full cursor-pointer flex items-center justify-start gap-3 bg-[#2B73F4]/20 hover:bg-[#2B73F4]/30 text-white border border-[#2B73F4]/50 h-16"
      >
        <Mail className="w-6 h-6 ml-2" />
        <div className="text-left">
          <p className="font-medium">Email</p>
          <p className="text-xs opacity-80">Recevez un code par email</p>
        </div>
      </Button>
    </div>

    <Button
      type="button"
      onClick={onCancel}
      variant="ghost"
      className="mt-8 text-white text-md cursor-pointer hover:text-white hover:bg-transparent flex items-center gap-1 mx-auto"
    >
      <ChevronLeft className="w-4 h-4" />
      Annuler
    </Button>
  </motion.div>
);

const OTPInput = ({
  verificationMethod,
  otpValue,
  setOtpValue,
  onSubmit,
  onMethodSelectorOpen,
  onClose,
  handleSubmit,
  register,
  errors,
  isVerifying,
  isWhatsappAuth,
}: {
  verificationMethod: string;
  otpValue: string;
  setOtpValue: (value: string) => void;
  onSubmit: (data: z.infer<typeof otpSchema>) => void;
  onMethodSelectorOpen: () => void;
  onClose: () => void;
  handleSubmit: any;
  register: any;
  errors: any;
  isVerifying: boolean;
  isWhatsappAuth: boolean;
}) => {
  const getIcon = () => {
    switch (verificationMethod) {
      case "authenticator":
        return <Shield className="w-20 h-20 font-medium" />;
      case "sms":
        return <Smartphone className="w-20 h-20 font-medium" />;
      case "email":
        return <Mail className="w-20 h-20 font-medium" />;
      default:
        return <Shield className="w-20 h-20 font-medium" />;
    }
  };

  const getTitle = () => {
    switch (verificationMethod) {
      case "authenticator":
        return "2FA";
      case "sms":
        return "WhatsApp";
      case "email":
        return "Email";
      default:
        return "2FA";
    }
  };

  const getDescription = () => {
    switch (verificationMethod) {
      case "authenticator":
        return "Entrez votre code OTP à 6 chiffres de votre application Authenticator.";
      case "sms":
        return "Entrez le code à 6 chiffres envoyé à votre numéro WhatsApp.";
      case "email":
        return "Entrez le code à 6 chiffres envoyé à votre adresse email.";
      default:
        return "Entrez votre code OTP à 6 chiffres de votre application Authenticator.";
    }
  };

  const ErrorMessage = ({
    name,
  }: {
    name: keyof z.infer<typeof otpSchema>;
  }) => (
    <p className="mt-1 text-xs sm:text-sm text-red-300">
      {errors[name]?.message?.toString()}
    </p>
  );

  return (
    <motion.div
      key="otp-input"
      className="flex flex-col items-center text-center px-4"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <span className="text-[#2B73F4] text-6xl mb-6">{getIcon()}</span>
      <h2 className="text-white bg-clip-text font-bold text-[32px] font-sans tracking-tight mb-3">
        Vérification {getTitle()}
      </h2>
      <p className="text-[18px] font-normal mx-auto max-w-[400px] text-white mb-4 text-center">
        {getDescription()}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <InputOTP
            {...register("code")}
            className="border-white-700"
            maxLength={6}
            value={otpValue}
            onChange={setOtpValue}
          >
            <InputOTPGroup>
              <InputOTPSlot
                index={0}
                className="w-10 h-10 text-white text-lg border-white-800 rounded-md"
              />
              <InputOTPSlot
                index={1}
                className="w-10 h-10 text-white text-lg border-white-800 rounded-md"
              />
              <InputOTPSlot
                index={2}
                className="w-10 h-10 text-white text-lg border-white-800 rounded-md"
              />
            </InputOTPGroup>
            <InputOTPSeparator className="text-white" />
            <InputOTPGroup>
              <InputOTPSlot
                index={3}
                className="w-10 h-10 text-white text-lg border-white-800 rounded-md"
              />
              <InputOTPSlot
                index={4}
                className="w-10 h-10 text-white text-lg border-white-800 rounded-md"
              />
              <InputOTPSlot
                index={5}
                className="w-10 h-10 text-white text-lg border-white-800 rounded-md"
              />
            </InputOTPGroup>
          </InputOTP>
          <ErrorMessage name="code" />
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={onMethodSelectorOpen}
          className="text-[#2B73F4] cursor-pointer hover:text-[#2B73F4]/80 hover:bg-[#2B73F4]/10 flex items-center gap-1 mx-auto text-md font-light"
        >
          <ChevronLeft className="w-4 h-4" />
          Changer de méthode de vérification
        </Button>

        <div className="flex flex-row gap-4 items-center justify-center pt-6">
          <Button
            type="button"
            size="lg"
            onClick={onClose}
            className="gradient-btn-secondary text-md px-10 w-[140px] truncate"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            size="lg"
            className="gradient-btn-primary text-md px-10 w-[140px] truncate"
            disabled={isVerifying}
          >
            {isVerifying || isWhatsappAuth ? "Chargement..." : "Envoyer"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export const TwoFactorOverlay = (props: TwoFactorOverlayProps) => (
  <AnimatePresence>
    {props.isOpen && (
      <motion.div
        className="absolute inset-0 bg-[#272744]/95 backdrop-blur-xl rounded-xl flex flex-col items-center justify-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          {props.showMethodSelector ? (
            <MethodSelector
              twoFactorAuth={props.twoFactorAuth}
              onMethodChange={props.onMethodChange}
              onCancel={() => props.setShowMethodSelector(false)}
            />
          ) : (
            <OTPInput
              verificationMethod={props.verificationMethod}
              otpValue={props.otpValue}
              setOtpValue={props.setOtpValue}
              onSubmit={props.onSubmit}
              onMethodSelectorOpen={() => props.setShowMethodSelector(true)}
              onClose={props.onClose}
              handleSubmit={props.handleSubmit}
              register={props.register}
              errors={props.errors}
              isVerifying={props.isVerifying}
              isWhatsappAuth={props.isWhatsappAuth}
            />
          )}
        </AnimatePresence>
      </motion.div>
    )}
  </AnimatePresence>
);
