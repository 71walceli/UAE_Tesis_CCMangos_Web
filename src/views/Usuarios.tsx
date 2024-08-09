import React, {  } from 'react';
import { textFilter, selectFilter, } from "react-bootstrap-table2-filter"

import { Endpoints } from '../../../Common/api/routes';
import { IUser } from '../../../Common/interfaces/models';
import { useCoontroller } from '../controllers/useController';
import { useFormManager, ValidationError } from '../hooks/useFormManager';
import { RecordsScreen } from '../components/RecordsScreen';
import { ROLES } from '../../../Common/data';
import { FormField } from '../components/Form';


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
    if (cedula.length !== 10) {
      throw new ValidationError("La longitud debe ser de 10 dígitos.");
    }
    if (!/^\d+$/.test(cedula)) {
      throw new ValidationError("Debe contener solo dígitos.");
    }
    const provincia = parseInt(cedula.substring(0, 2));
    if ((provincia < 1 || provincia > 24) && provincia !== 30) {
      throw new ValidationError("La provincia no es válida.");
    }
    const digitos = cedula.substring(0, 9).split("").map(Number);
  
    // Algoritmo de Luhn
    for (let i = 0; i < 9; i += 2) {
      digitos[i] *= 2;
      if (digitos[i] > 9) {
        digitos[i] -= 9;
      }
    }
  
    const sumaTotal = digitos.reduce((sum, digit) => sum + digit, 0);
    const digitoVerificador = (10 - (sumaTotal % 10)) % 10;
    return digitoVerificador === parseInt(cedula.charAt(9));
  }
  const validateEmail = (email) => String(email).toLowerCase().match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  const formValidator: Object = {
    cedula: v => {
      if (!validarCedula(v)) {
        throw new ValidationError("Número de cédula inválido");
      }
    },
    first_name: v => {
      if (!/^[A-ZÁÉÍÓÚ][a-záéíóúü]{1,20}(?:\s[A-ZÁÉÍÓÚ][a-záéíóúü]{1,20})*$/.test(v))
        throw new ValidationError(
          "Uno o más nombres que empiecen con mayúscula"
        );
    },
    last_name: v => {
      if (!/^[A-ZÁÉÍÓÚ][a-záéíóúü]{1,20}(?:\s[A-ZÁÉÍÓÚ][a-záéíóúü]{1,20})*$/.test(v))
        throw new ValidationError(
          "Uno o más apellidos que empiecen con mayúscula"
        );
    },
    email: v => {
      if (!validateEmail(v))
        throw new ValidationError("No es un email válido");
    },
    username: v => {
      if (!/^[A-Za-z0-9.,]{6,50}$/.test(v))
        throw new ValidationError("Debe ser un nombre de persona.");
    },
    password: (v, form) => {
      if (form.id && (v === "" || !v)) 
        return
      if (v?.length < 8)
        throw new ValidationError("Debe tener al menos 8 caracteres.");
      if (!/[A-Z]+/.test(v))
        throw new ValidationError("Debe tener al menos una letra mayúscula");
      if (!/[a-z]+/.test(v))
        throw new ValidationError("Debe tener al menos una letra minúscula");
      if (!/[0-9]+/.test(v))
        throw new ValidationError("Debe tener al menos un número");
      if (!/[^A-Za-z0-9/]/.test(v))
        throw new ValidationError("Debe tener al menos un símbolo");
    },
    roles: v => {
      if (v?.length < 1)
        throw new ValidationError("Debe seleccionar al menos un rol.")
    }
  };
  const formManager = useFormManager(reset, formValidator);

  const formFields = [
    {
      name: "cedula",
      label: "Cédula",
      bclass: "form-control",
      placeholder: "Ejemplo: 1234567890",
    },
    {
      name: "first_name",
      label: "Nombre",
      bclass: "form-control",
      placeholder: "Ejemplo: Fulano Mengano",
    },
    {
      name: "last_name",
      label: "Apellido",
      bclass: "form-control",
      placeholder: "Ejemplo: Peregano Ruiz",
    },
    {
      name: "email",
      label: "Dirección de e-mail",
      bclass: "form-control",
      placeholder: "Ejemplo: aeiou@ejemplo.com",
    },
    {
      name: "username",
      label: "Nombre de usuario",
      bclass: "form-control",
      placeholder: "Ejemplo: usuario.123",
    },
    {
      name: "password",
      label: "Contraseña",
      bclass: "form-control",
      inputType: "password",
      placeholder: formManager.data.id ? "La contraseña actual se mantendrá." : "Ejemplo: aA3457.@s",
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
      formFields__React={<>
        {formFields.map((props, index) => <FormField key={index} {...props} />)}
      </>}
    />
  )
}