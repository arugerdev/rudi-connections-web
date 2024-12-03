import { object, ref, string } from "yup";

export const LoginSchema = object().shape({
  email: string()
    .email("Este campo debe de ser un correo electrónico")
    .required("Este campo es requerido"),
  password: string().required("Este campo es requerido"),
});

export const RegisterSchema = object().shape({
  name: string().required("Este campo es requerido"),
  email: string()
    .email("Este campo debe de ser un correo electrónico")
    .required("Este campo es requerido"),
  password: string().required("PEste campo es requerido"),
  confirmPassword: string()
    .required("Este campo es requerido")
    .oneOf([ref("password")], "Las contraseñas deben ser iguales"),
});
export const DeviceIdSchema = object().shape({
  id: string().required("El id del dispositivo es necesario para añadirlo"),
});
