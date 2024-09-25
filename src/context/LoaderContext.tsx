import React, { createContext, useState } from "react";
import { LoaderAnimation } from "../components/LoaderAnimation";

// Definir el tipo de estado del loader
type LoaderContextProps = {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
};

// Crear el contexto de loader
export const LoaderContext = createContext({} as LoaderContextProps);

// Proveedor del contexto de loader
export const LoaderProvider = ({ children }: any) => {
  const [counter, setCounter] = useState(0);
  const isLoading = counter > 0;
  
  const showLoader = () => {
    setCounter(v => v + 1);
  };

  const hideLoader = () => {
    // TODO setTimeout(() => { setCounter(v => v - 1); }, 100);
    setTimeout(() => { setCounter(v => v > 0 ? v - 1 : 0); }, 166);
    //setCounter(v => v - 1);
  };

  return (
    // TODO Apply smooth animation just like mobile app
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {isLoading && <LoaderAnimation />}
      {children}
    </LoaderContext.Provider>
  );
};
