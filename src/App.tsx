import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, } from "react-router-dom";
import { Login } from "./views/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import { useAuth } from "./context/AuthContext";
import { Home } from "./views/Home";
import { Lotes } from "./views/Lotes";
import { Áreas } from "./views/Áreas";
import { Plantas } from "./views/Plantas";
import { Sincronizaciones } from "./views/Clima";
import { Usuarios } from "./views/Usuarios";
import { Estimaciones } from "./views/Estimaciones";
import { Estadisticas } from "./views/Estadisticas";
import { Profile } from "./views/Profile";
import { Lecturas } from "./views/Lecturas";
import { Produccion } from "./views/Produccion";
import { Roles } from "./views/Roles";

import 'rsuite/dist/rsuite-no-reset.css';
import { Variedad } from "./views/Variedades";
import { Enfermedad } from "./views/Enfermedades";


const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, [isAuthenticated]);

  if (!isReady) {
    return null;
  }
  
  const publicUrl = process.env.PUBLIC_URL || ""

  return (
    <>
      <Router>
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="*" element={<Navigate to={`${publicUrl}/home`} />} />
              <Route path={`${publicUrl}/home`} element={<Home />} />
              <Route path={`${publicUrl}/crop/areas`} element={<Áreas />} />
              <Route path={`${publicUrl}/crop/lots`} element={<Lotes />} />
              <Route path={`${publicUrl}/crop/trees`} element={<Plantas />} />
              <Route path={`${publicUrl}/crop/readings`} element={<Lecturas/>} />
              <Route path={`${publicUrl}/crop/production`} element={<Produccion/>} />
              <Route path={`${publicUrl}/crop/affection`} element={<Enfermedad/>} />
              <Route path={`${publicUrl}/crop/variety`} element={<Variedad/>} />
              <Route path={`${publicUrl}/weather/sync`} element={<Sincronizaciones/>} />
              <Route path={`${publicUrl}/auth/users`} element={<Usuarios/>} />
              <Route path={`${publicUrl}/auth/Profile`} element={<Profile/>} />
              <Route path={`${publicUrl}/auth/role`} element={<Roles/>} />
              <Route path={`${publicUrl}/pred/averange`} element={<Estimaciones/>} />
              <Route path={`${publicUrl}/pred/analytics`} element={<Estadisticas/>} />
            </>
          ) : (
            <>
              <Route path="*" element={<Navigate to={`${publicUrl}/auth/login`} />} />
              <Route path={`${publicUrl}/auth/login`} element={<Login />} />
            </>
          )}
        </Routes>
      </Router>
    </>
  );
};

export default App;
