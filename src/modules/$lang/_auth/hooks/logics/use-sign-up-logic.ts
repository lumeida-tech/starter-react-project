import type { CustomHookProps } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  useRegisterMutation,
  useResendActivationEmailMutation,
} from "../../hooks";
import { signUpSchema, type SignUpType } from "../../schemas";
import { isSuccessfullyRegisteredAtom } from "../../stores";
import { langAtom } from "@/shared/atoms";
import { useAtomValue } from "jotai";

export default function useSignUpFormLogic(): CustomHookProps {
  /*
     |--------------------------------------------------------------------------
     | Data Section
     |--------------------------------------------------------------------------
     | List of all variables used inside the component
     |
     */

  const navigate = useNavigate();
    const currentLang = useAtomValue(langAtom);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState<"user" | "enterprise">("user");
  const formRef = useRef<HTMLFormElement>(null);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);
  const [isSuccessfullyRegistered, setIsSuccessfullyRegistered] = useAtom(
    isSuccessfullyRegisteredAtom
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      accountType: "user",
    },
  });

  const resendActivationEmailMutation = useResendActivationEmailMutation();
  const registerMutation = useRegisterMutation();

  /*
    |--------------------------------------------------------------------------
    | Methods Section
    |--------------------------------------------------------------------------
    | List of all functions used inside the component
    |
    */

  function handleTabChange(value: string | "user" | "enterprise") {
    setAccountType(value as "user" | "enterprise");
    setValue("accountType", value as "user" | "enterprise");
    reset({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountType: value as "user" | "enterprise",
      name: "",
      head_office: "",
      siret_number: "",
    });
  }

  function gotoSignIn() {
    reset();
    navigate({ to: "/$lang/sign-in" , params: { lang: currentLang }});
    setIsSuccessfullyRegistered(false);
  }

  function onSubmit(data: SignUpType) {
    registerMutation.mutate(data);
  }

  function handleResendActivationEmail(email: string) {
    resendActivationEmailMutation.mutate(email);
  }

  return {
    state: {
      showPassword,
      showConfirmPassword,
      accountType,
      togglePassword,
      toggleConfirmPassword,
      isSuccessfullyRegistered,
    },
    handlers: {
      handleTabChange,
      onSubmit,
      handleResendActivationEmail,
      togglePassword,
      toggleConfirmPassword,
      gotoSignIn,
    },
    mutations: {
      registerMutation,
      resendActivationEmailMutation,
    },
    ref: {
      formRef,
    },
    form: {
      register,
      handleSubmit,
      setValue,
      reset,
      errors,
    },
  };
}
