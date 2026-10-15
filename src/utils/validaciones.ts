import * as yup from "yup";

export const esquemaRegistroPasajero = yup.object({
  // Paso 1: Acceso
  correo: yup.string().email("Correo inválido").required("Requerido"),
  telefono: yup.string().required("Requerido").min(9, "Debe tener 9 dígitos"),
  contrasena: yup.string()
    .required("Requerido")
    .min(8, "Mínimo 8 caracteres")
    .matches(/[A-Z]/, "Falta una mayúscula")
    .matches(/[a-z]/, "Falta una minúscula")
    .matches(/[0-9]/, "Falta un número")
    .matches(/[\W_]/, "Falta un símbolo"),
  confirmarContrasena: yup.string()
    .required("Confirma tu contraseña")
    .oneOf([yup.ref("contrasena")], "Las contraseñas no coinciden"),

  // Paso 2: Identidad
  dni: yup.string().length(8, "El DNI debe tener 8 dígitos").required("Requerido"),
  nombres: yup.string().required("Requerido"),
  apellidos: yup.string().required("Requerido"),
  fechaNacimiento: yup.string()
    .required("Selecciona tu fecha de nacimiento")
    .test("es-mayor-de-edad", "Debes tener al menos 18 años para registrarte", (valor) => {
      if (!valor) return false;
      const partes = valor.split("-");
      if (partes.length !== 3) return false;
      const [anio, mes, dia] = partes.map(Number);
      if (!anio || !mes || !dia) return false;
      const nacimiento = new Date(anio, mes - 1, dia);
      const hoy = new Date();
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const m = hoy.getMonth() - nacimiento.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      return edad >= 18;
    }),
  fotoPerfil: yup.string().nullable().optional(),
  fotoBase64: yup.string().nullable().optional(),
});

export type TipoDatosPersonales = yup.InferType<typeof esquemaRegistroPasajero>;

export const esquemaPaso1 = esquemaRegistroPasajero.pick([
  "correo",
  "contrasena",
  "confirmarContrasena",
]);

export const esquemaNuevaContrasena = yup.object({
  password: yup.string().required("Requerido").min(8, "Mínimo 8 caracteres"),
  confirmPassword: yup
    .string()
    .required("Requerido")
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
});
