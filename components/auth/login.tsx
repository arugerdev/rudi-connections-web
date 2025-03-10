"use client";

import { LoginSchema } from "@/helpers/schemas";
import { LoginFormType } from "@/helpers/types";
import { addToast, Button, Input } from "@heroui/react";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { signInWithEmail } from "./supabase-auth";

export const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  const initialValues: LoginFormType = {
    email: "",
    password: "",
  };

  const handleLogin = useCallback(
    async (values: LoginFormType) => {
      setLoading(true)
      // `values` contains email & password. You can use provider to connect user
      signInWithEmail(values.email, values.password).then((data) => {

        setLoading(false)
        addToast({
          title: "🎉✅ ¡Inicio de sesión realizado correctamente!",
          description: "Bienvenido de nuevo a Rud1.es",
          color: 'success',
        })
        router.push('/')
      }).catch((err) => {
        setLoading(false)
        addToast({
          title: "Ha ocurrido un error en el inicio de sesión 😢",
          description: JSON.stringify(err),
          color: 'danger',
        })
        console.log(err)

        return
      })

    },
    [router]
  );

  return (
    <>
      <div className='text-center text-[25px] font-bold mb-6'>Iniciar Sesión</div>

      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}>
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <form action="javascript:void(0)" className="w-full flex items-center justify-center flex-col" onSubmit={() => handleSubmit}>
            < div className='flex flex-col w-1/2 gap-4 mb-4'>
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
            </div>

            <Button
              isLoading={loading}
              onPress={() => handleSubmit()}
              variant='flat'
              type="submit"
              color='primary'>
              Entrar
            </Button>
          </form >
        )}
      </Formik >

      <div className='font-light dark:text-slate-200 light:text-slate-600 mt-4 text-sm'>
        ¿Aún no tienes una cuenta?{" "}
        <a href='/register' className='font-bold'>
          Crea una aquí
        </a>
      </div>
    </>
  );
};
