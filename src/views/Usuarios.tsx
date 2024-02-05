import React, {  } from 'react';
import { Endpoints } from '../../../Common/api/routes';
import { IUser } from '../../../Common/interfaces/models';
import { textFilter, } from "react-bootstrap-table2-filter"
import { useCoontroller } from '../controllers/useController';
import { useFormManager } from '../hooks/useFormManager';
import { RecordsScreen } from '../components/RecordsScreen';


export const Usuarios = () => {
  const controller = useCoontroller<IUser>(Endpoints.Users)

  const columns = [
    {
      dataField: 'cedula',
      text: 'Cédula',
      sort: true,
      filter: textFilter()
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
  ];

  const reset = (initial?: {
    cedula: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
  }) => {
    return ({
      ...initial,
      cedula: initial?.cedula || "",
      first_name: initial?.first_name || "",
      last_name: initial?.last_name || "",
      email: initial?.email || "",
      username: initial?.username || "",
    });
  };

  const formManager = useFormManager(reset);

  return (
    <RecordsScreen columns={columns} controller={controller} formManager={formManager}
      formFields={[
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
          placeholder: "Fulano",
        },
        {
          name: "last_name",
          label: "Apellido",
          bclass: "form-control",
          placeholder: "Escriba el código de planta",
        },
        {
          name: "email",
          label: "Dirección de email",
          bclass: "form-control",
          placeholder: "Escriba el código de planta",
        },
        {
          name: "username",
          label: "Nombre de usuario",
          bclass: "form-control",
          placeholder: "Escriba el nombre",
        },
        {
          name: "password",
          label: "Contraseña",
          bclass: "form-control",
          type: "password",
          placeholder: "Escriba el nombre",
        },
        // TODO Agregar mapa
      ]}
    />
  )
}