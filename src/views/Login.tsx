import React, { useContext } from "react";

import { CardLogin } from "../components/CardLogin";
import { TokenResponse } from "../../../Common/interfaces/models";
import { Endpoints } from "../../../Common/api/routes";
import { useAuth } from "./../context/AuthContext";
import { useApiController } from "../../../Common/api/useApi";
import useToaster from "../hooks/useToaster";
import { ROLES } from '../../../Common/data';


export const Login = () => {
  const auth = useAuth();
  const { login } = auth;
  const { post } = useApiController(auth);
  const { notify } = useToaster()
  const Login = async (username: string, password: string) => {
    if (username === '' || password === '') {
      notify("Rellene todos los campos", "error")
      return
    }
    await post<TokenResponse>(Endpoints.login, {
      username,
      password,
    })
      .then((e) => {
        e.user=username;
        const idRolAdmin = ROLES.find(rol => rol.label === "Administrador").value
        console.log({e, idRolAdmin});
        if (!e.usuario.roles.includes(idRolAdmin)) {
          const mensaje = "Solo los administradores pueden iniciar sesión mediante interfaz Web";
          notify(mensaje, "error")
          throw new Error(mensaje)
        }
        login(e);
      })
      .catch((error) => {
        if (error?.response?.data)
          notify(error.response.data, "error")
        console.error(error);
      });
  };

  const isLogin = (username: string, password: string) => Login(username, password);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage:
          "radial-gradient(circle, rgba(0,85,60,1) 20%, rgba(114,176,29,1) 100%)",
      }}
    >
      <CardLogin onLogin={isLogin}></CardLogin>
    </div>
  );
};
