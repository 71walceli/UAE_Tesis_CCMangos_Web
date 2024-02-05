import { useState } from 'react';
import { IRol } from '../../../Common/interfaces/models';
export const usePlantaState = () => {
  const [Planta, setPlanta] = useState({
    usuarios: "",
  });

  const handleInputChange = (name: string, value: string) => {
    setPlanta({
      ...Planta,
      [name]: value,
    });
  };

  const resetPlanta = () => {
    setPlanta({
      usuarios: "",
    });
  };

  return { Planta, handleInputChange, resetPlanta };
};

export const useRolState = () => {
  const [Rol, setRol] = useState<IRol|null>(null);

  const handleInputChange = (name: string, value: string) => {
    setRol({
      ...Rol!,
      [name]: value,
    });
  };

  const resetRol = () => {
    setRol(null);
  };

  return { Rol, handleInputChange, resetRol };
};