import React, {  } from 'react';
import { Endpoints } from '../../../Common/api/routes';
import { IUser } from '../../../Common/interfaces/models';
import { textFilter, selectFilter, } from "react-bootstrap-table2-filter"
import { useCoontroller } from '../controllers/useController';
import { useFormManager } from '../hooks/useFormManager';
import { RecordsScreen } from '../components/RecordsScreen';
import { ROLES } from '../../../Common/data';


export const Usuarios = () => {
  const controller = useCoontroller<IUser>(Endpoints.Users)
  
  const columns = [
    {
      dataField: 'cedula',
      text: 'Cédula',
      sort: true,
      filter: textFilter(),
      maxlength: 10,
    },
    {
      dataField: 'first_name',
      text: 'Nombre',
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'last_name',
      text: 'Aplellido',
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'email',
      text: 'Correo',
      sort: true,
      filter: textFilter(),
      style: {
        overflowWrap: "break-word",
      },
    },
    {
      dataField: 'username',
      text: 'Usuario',
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: 'roles',
      text: 'Roles',
      sort: true,
      filter: selectFilter({
        options: ROLES
          .reduce((all, {label, value}) => Object.assign(all, {[value]: label}), {}),
        multiple: true,
      }),
      formatter: roles => ROLES.filter(rol => roles.findIndex(e => e === rol.value) > -1)
        .map(rol => rol.label).join(", ")
    },
  ];

  const reset = (initial?: {
    id: number;
    cedula: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    roles: Array<{
      value: string | number;
      label: string;
    }>
  }) => {
    return ({
      id: initial?.id,
      cedula: initial?.cedula || "",
      first_name: initial?.first_name || "",
      last_name: initial?.last_name || "",
      email: initial?.email || "",
      username: initial?.username || "",
      Id_Hacienda: 1, // TODO Permitir elegir hacienda
      roles: ROLES.filter(rol => initial?.roles?.findIndex(e => e === rol.value) > -1),
    });
  };

  function validarCedula(cedula) {
    // Verificar longitud de la cédula
    if (cedula.length !== 10) {
      throw new Error("La longitud debe ser de 10 dígitos.");
    }
  
    // Verificar que todos los caracteres sean dígitos
    if (!/^\d+$/.test(cedula)) {
      throw new Error("Debe contener solo dígitos.");
    }
  
    // Obtener la provincia
    const provincia = parseInt(cedula.substring(0, 2));
    if ((provincia < 1 || provincia > 24) && provincia !== 30) {
      throw new Error("La provincia no es válida.");
    }
  
    // Obtener los primeros 9 dígitos
    const digitos = cedula.substring(0, 9).split("").map(Number);
  
    // Aplicar el algoritmo de Luhn
    for (let i = 0; i < 9; i += 2) {
      digitos[i] *= 2;
      if (digitos[i] > 9) {
        digitos[i] -= 9;
      }
    }
  
    // Calcular la suma total
    const sumaTotal = digitos.reduce((sum, digit) => sum + digit, 0);
  
    // Calcular el dígito verificador
    const digitoVerificador = (10 - (sumaTotal % 10)) % 10;
  
    // Comparar el dígito verificador calculado con el dígito verificador proporcionado
    return digitoVerificador === parseInt(cedula.charAt(9));
  }
  const validateEmail = (email) => String(email).toLowerCase().match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  const formValidator: Object = {
    cedula: v => {
      if (!validarCedula(v)) {
        throw new Error("Número de cédula inválido");
      }
    },
    first_name: v => {
      if (!/^[A-ZÁÉÍÓÚ][a-záéíóúü]{1,20}(?:\s[A-ZÁÉÍÓÚ][a-záéíóúü]{1,20})*$/.test(v))
        throw new Error(
          "Debe ser uno o más nombres que empiecen con mayúscula separados por espacio."
        );
      // TODO Check for all codes not to be used
    },
    last_name: v => {
      if (!/^[A-ZÁÉÍÓÚ][a-záéíóúü]{1,20}(?:\s[A-ZÁÉÍÓÚ][a-záéíóúü]{1,20})*$/.test(v))
        throw new Error(
          "Debe ser uno o más apellidos que empiecen con mayúscula separados por espacio."
        );
      // TODO Check for all codes not to be used
    },
    email: v => {
      if (!validateEmail(v))
        throw new Error("No es un email válido");
    },
    username: v => {
      if (!/^[A-Za-z0-9.,]{6,50}$/.test(v))
        throw new Error("Debe ser un nombre de persona.");
    },
    password: (v, form) => {
      if (form.id && (v === "" || !v)) 
        return
      if (v?.length < 8)
        throw new Error("Debe tener al menos 8 caracteres.");
      if (!/[A-Z]+/.test(v))
        throw new Error("Debe tener al menos una letra mayúscula");
      if (!/[a-z]+/.test(v))
        throw new Error("Debe tener al menos una letra minúscula");
      if (!/[0-9]+/.test(v))
        throw new Error("Debe tener al menos un número");
      if (!/[^A-Za-z0-9/]/.test(v))
        throw new Error("Debe tener al menos un símbolo");
    },
    roles: v => {
      if (v?.length < 1)
        throw new Error("Debe seleccionar al menos un rol.")
    }
  };
  const formManager = useFormManager(reset, formValidator);

  const formFields = [
    {
      name: "cedula",
      label: "Cédula",
      bclass: "form-control",
      placeholder: "1234567890",
    },
    {
      name: "first_name",
      label: "Nombre",
      bclass: "form-control",
      placeholder: "",
    },
    {
      name: "last_name",
      label: "Apellido",
      bclass: "form-control",
      placeholder: "",
    },
    {
      name: "email",
      label: "Dirección de e-mail",
      bclass: "form-control",
      placeholder: "aeiou@ejemplo.com",
    },
    {
      name: "username",
      label: "Nombre de usuario",
      bclass: "form-control",
      placeholder: "usuario.123",
    },
    {
      name: "password",
      label: "Contraseña",
      bclass: "form-control",
      inputType: "password",
      placeholder: formManager.data.id ? "La contraseña actual se mantendrá." : "",
      tips: <>
        <p>
          La contraseña ha de tener al menos 10 caracteres, constando de
        </p>
        <ul>
          <li>Al menos una letra minúscula</li>
          <li>Al menos una letra mayúscula</li>
          <li>Al menos un dígito</li>
          <li>Al menos un carácter especial</li>
        </ul>
        <p>
          Ejemplo: <code>aA3457.@s</code>
        </p>
      </>,
    },
    {
      name: "roles",
      label: "Roles",
      inputType: "select",
      options: ROLES,
      multiple: true,
      bclass: "form-control",
    },
  ];

  return (
    <RecordsScreen pageTitle="Usuarios"
      columns={columns} controller={controller} formManager={formManager}
      formFields={formFields}
    />
  )
}