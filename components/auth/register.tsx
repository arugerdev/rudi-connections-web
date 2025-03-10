"use client";

import { RegisterSchema } from "@/helpers/schemas";
import { RegisterFormType } from "@/helpers/types";
import { addToast, Button, Input } from "@heroui/react";
import { Formik } from "formik";
import { redirect, useRouter } from "next/navigation";
import { useCallback } from "react";
import { signUpNewUser } from "./supabase-auth";
export const Register = () => {
  const router = useRouter();

  const initialValues: RegisterFormType = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleRegister = useCallback(
    async (values: RegisterFormType) => {
      if (values.password !== values.confirmPassword) return

      signUpNewUser(values.name, values.email, values.password).then((data) => {
        addToast({
          title: "🎉✅ ¡Registro realizado correctamente!",
          description: "Gracias por registrarte en Rud1.es",
          color: 'success',
        })
        router.push("/");
      }).catch((err) => {
        addToast({
          title: "Ha ocurrido un error al realizar el registro 😢",
          description: JSON.stringify(err),
          color: 'danger',
        })
        return
      })

      router.replace("/");
      redirect("/")
    },
    [router]
  );

  return (
    <>
      <div className='text-center text-[25px] font-bold mb-6'>Crear cuenta</div>

      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}>
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <form action="javascript:void(0)" className="w-full flex items-center justify-center flex-col" onSubmit={() => handleSubmit}>
            <div className='flex flex-col w-1/2 gap-4 mb-4'>
              <Input
                variant='bordered'
                label='Name'
                value={values.name}
                isInvalid={!!errors.name && !!touched.name}
                errorMessage={errors.name}
                onChange={handleChange("name")}
              />
              <Input
                variant='bordered'
                label='Email'
                type='email'
                value={values.email}
                isInvalid={!!errors.email && !!touched.email}
                errorMessage={errors.email}
                onChange={handleChange("email")}
              />
              <Input
                variant='bordered'
                label='Password'
                type='password'
                value={values.password}
                isInvalid={!!errors.password && !!touched.password}
                errorMessage={errors.password}
                onChange={handleChange("password")}
              />
              <Input
                variant='bordered'
                label='Confirm password'
                type='password'
                value={values.confirmPassword}
                isInvalid={
                  !!errors.confirmPassword && !!touched.confirmPassword
                }
                errorMessage={errors.confirmPassword}
                onChange={handleChange("confirmPassword")}
              />
            </div>

            <Button
              onPress={() => handleSubmit()}
              type="submit"
              variant='flat'
              color='primary'>
              Crear
            </Button>
          </form>
        )}
      </Formik>

      <div className='font-light dark:text-slate-200 light:text-slate-600 mt-4 text-sm'>
        ¿Ya tienes una cuenta?{" "}
        <a href='/login' className='font-bold'>
          Inicia sesión aquí
        </a>
      </div>
    </>
  );
};

