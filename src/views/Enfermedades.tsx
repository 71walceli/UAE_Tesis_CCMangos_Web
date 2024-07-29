import React, {  } from 'react';
import { textFilter } from 'react-bootstrap-table2-filter';

import { Endpoints } from '../../../Common/api/routes';
import { ILote } from '../../../Common/interfaces/models';
import { useCoontroller } from '../controllers/useController';
import { RecordsScreen } from '../components/RecordsScreen';
import { useFormManager, ValidationError } from '../hooks/useFormManager';
import { FormField } from '../components/Form';


export const Enfermedad: React.FC = () => {
  const controller = useCoontroller<ILote>(Endpoints.enfermedad)
  
  const reset = (initial?: {
    Codigo: string;
    Nombre: string;
    Variedad: string;
  }) => ({
    ...initial,
    Codigo: initial?.Codigo || "",
    Nombre: initial?.Nombre || "",
  });
  
  const formValidator: Object = {
    Codigo: async v => {
      if (v.substring(0,1) !== "E") 
        throw new ValidationError("Cada lote debe empezar con V.")
      if (!/^[A-Za-z0-9]+$/.test(v.substring(1))) 
        throw new ValidationError("No debe tener espacios, carecteres especiales ni en minúscula.")
      if (v.length < 2 || v.length > 6) 
        throw new ValidationError("Debe estar entre 3 y 5 caracteres.")
    },
    Nombre: v => {
      if (v.length < 5) 
        throw new ValidationError("Al menos 5 caracteres")
      v = v.split(" ")
      if (v.filter(w => !/^[A-ZÁÉÍÓÚÜÑa-záéíóúü0-9ñ.-:]{1,20}$/.test(w)).length > 0) 
        throw new ValidationError("Debe ser uno o más nombres y/o dígitos.")
    },
  };
  const formManager = useFormManager(reset, formValidator)


  return <RecordsScreen formManager={formManager} controller={controller} 
    pageTitle="Enfermedades" 
    columns={[
      {
        dataField: 'Codigo',
        text: 'Codigo',
        sort: true,
        filter: textFilter(),
      },
      {
        dataField: 'Nombre',
        text: 'Nombre',
        sort: true,
        filter: textFilter(),
      },
    ]} 
    formFields__React={<>
      <FormField
        name="Codigo"
        label="Código"
        placeholder="Ejemplo: Eab1" />
      <FormField
        name="Nombre"
        label="Nombre"
        placeholder="Use un nombre descriptivo" />
      {/* <DrawMap /> */}
    </>}
  />;
};
