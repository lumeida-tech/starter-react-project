import { useState, useRef, useEffect, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAtom, useAtomValue } from "jotai";
import {
  inActiveAlertOpenAtom,
  show2FAAtom,
  twoFactorAuthAtom,
} from "../../stores/auth-atoms";
import {  otpSchema } from "../../schemas";
import {
  useAxmarilLoginMutation,
  useGoogleLoginMutation,
  useLoginMutation,
  useResendActivationEmailMutation,
} from "../index";
import {
  useSendOTPCodeMutation,
  useTwoFactorAuthMutation,
  useWhatsAppAuthMutation,
} from "../index";

export default function useSignInFormLogic() {
  // État local
  const [showPassword, setShowPassword] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [showMethodSelector, setShowMethodSelector] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState("authenticator");

  // Références
  const formRef = useRef<HTMLFormElement>(null);

  // Atoms
  const [inActiveAlertOpen, setInActiveAlertOpen] = useAtom(
    inActiveAlertOpenAtom
  );
  const [show2FA, setShow2FA] = useAtom(show2FAAtom);
  const twoFactorAuth = useAtomValue(twoFactorAuthAtom);

  // Mutations
  const loginMutation = useLoginMutation();
  const resendActivationEmailMutation = useResendActivationEmailMutation();
  const googleLoginMutation = useGoogleLoginMutation();
  const axmarilLoginMutation = useAxmarilLoginMutation();
  const verify2FAMutation = useTwoFactorAuthMutation();
  const whatsappAuthMutation = useWhatsAppAuthMutation();
  const sendOTPCodeMutation = useSendOTPCodeMutation();

  // Configuration
  const baseURL = import.meta.env.VITE_APP_URL;

  // Form validation
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema), 
    defaultValues: {
      code: "",
    },
  });

  // Handlers
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    loginMutation.mutate(formData);
  };

  const handleResendActivationEmail = (email: string) => {
    resendActivationEmailMutation.mutate(email);
  };

  const handleGoogleLogin = () => {
    googleLoginMutation.mutate(baseURL + "/oauth");
  };

  const handleAxmarilLogin = () => {
    axmarilLoginMutation.mutate(baseURL + "/oauth");
  };

  const handleMethodChange = (method: SetStateAction<string>) => {
    setVerificationMethod(method);
    setShowMethodSelector(false);
    setOtpValue("");

    if (method === "sms") {
      sendOTPCodeMutation.mutate({
        email: formRef.current?.username.value || "",
        type: "number",
      });
    } else if (method === "email") {
      sendOTPCodeMutation.mutate({
        email: formRef.current?.username.value || "",
        type: "email",
      });
    }
  };

  const handle2FASubmit = (data: z.infer<typeof otpSchema>) => {
    const payload = {
      code: data.code,
      email: formRef.current?.username.value,
    };

    if (verificationMethod === "authenticator") {
      verify2FAMutation.mutate({ data: payload, type: "auth" });
    } else if (verificationMethod === "sms") {
      whatsappAuthMutation.mutate(payload);
    } else if (verificationMethod === "email") {
      verify2FAMutation.mutate({ data: payload, type: "auth" });
    }
  };

  const handle2FAClose = () => {
    formRef.current?.reset();
    setShow2FA(false);
    setOtpValue("");
  };

  const handleInactiveAlertClose = () => {
    formRef.current?.reset();
    setInActiveAlertOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Effects
  useEffect(() => {
    if (twoFactorAuth.appAuthEnabled) {
      setVerificationMethod("authenticator");
    } else if (twoFactorAuth.whatsappNumberEnabled) {
      setVerificationMethod("sms");
    } else if (twoFactorAuth.emailAuthEnabled) {
      setVerificationMethod("email");
    }
  }, [
    twoFactorAuth.appAuthEnabled,
    twoFactorAuth.whatsappNumberEnabled,
    twoFactorAuth.emailAuthEnabled,
  ]);

  return {
    state: {
      showPassword,
      otpValue,
      setOtpValue,
      showMethodSelector,
      setShowMethodSelector,
      verificationMethod,
      inActiveAlertOpen,
      show2FA,
      twoFactorAuth,
    },
    ref: {
      formRef,
    },

    form: {
      handleSubmit,
      register,
      errors,
    },

    mutations: {
      loginMutation,
      resendActivationEmailMutation,
      googleLoginMutation,
      axmarilLoginMutation,
      verify2FAMutation,
      whatsappAuthMutation,
      sendOTPCodeMutation,
    },

    handlers: {
      handleFormSubmit,
      handleResendActivationEmail,
      handleGoogleLogin,
      handleAxmarilLogin,
      handleMethodChange,
      handle2FASubmit,
      handle2FAClose,
      handleInactiveAlertClose,
      togglePasswordVisibility,
    },
  };
}
