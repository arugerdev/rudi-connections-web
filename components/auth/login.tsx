"use client";

import { createAuthCookie } from "@/actions/auth.action";
import { LoginSchema } from "@/helpers/schemas";
import { LoginFormType } from "@/helpers/types";
import { Button, Input } from "@nextui-org/react";
import { Formik } from "formik";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { signInWithEmail } from "./supabase-auth";
import { createClient } from "@supabase/supabase-js";
import toast from "react-hot-toast";

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
        toast.success("¡Inicio de sesión realizado correctamente! 🎉✅")
        router.push('/')
      }).catch((err) => {
        setLoading(false)
        toast.error("Ha ocurrido un error en el inicio de sesión 😢")
        console.log(err)

        alert(err)
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

      <div className='font-light text-slate-400 mt-4 text-sm'>
        ¿Aún no tienes una cuenta?{" "}
        <Link href='/register' className='font-bold'>
          Crea una aquí
        </Link>
      </div>
    </>
  );
};
