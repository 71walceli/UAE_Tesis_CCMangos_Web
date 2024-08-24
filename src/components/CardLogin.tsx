import React, { useState } from "react";

import { Card } from "./Card";
import { FormField, GenericForm, GenericFormReact } from "./Form";
import Isotipo from './../assets/Isologo.png';
import { useFormManager } from "../hooks/useFormManager";
import { CircleIconButton } from "./CircleIconButton";


interface CardLoginProps {
  onLogin: (username: string, password: string) => void;
}

export const CardLogin = ({ onLogin }: CardLoginProps) => {
  const handleLogin = e => {
    e.preventDefault();
    onLogin(manager.data.username, manager.data.password);
  };


  const formFields = [
    {
      name: "username",
      label: "Nombre de Usuario",
      placeholder: "Nombre de usuario",
    },
    {
      name: "password",
      label: "Contraseña",
      placeholder: "Contraseña",
      inputType: "password",
    },
    {
      name: "remember",
      inputType: "checkbox",
      label: "Recordarme?",
    },
  ];
  const manager = useFormManager(() => ({
    username: "",
    password: "",
    remember: true,
  }))

  return (
    <Card title="Iniciar Sesión" footer={null} image={Isotipo} w={"20rem"}>
      <GenericFormReact manager={manager}
      >
        {formFields.map((field) => <FormField {...field} />)}
      </GenericFormReact>
      <CircleIconButton icon="bi bi-rocket" title="Iniciar sesión" onPress={handleLogin} />
    </Card>
  );
};
