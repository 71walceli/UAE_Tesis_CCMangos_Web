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
  
  const formManager = useFormManager(
    ((initial?: {
      Codigo: string;
      Nombre: string;
      Variedad: string;
    }) => ({
      ...initial,
      Codigo: initial?.Codigo || "",
      Nombre: initial?.Nombre || "",
    })), 
    {
      Nombre: v => {
        if (v.length < 5)
          throw new ValidationError("Al menos 5 caracteres");
        v = v.split(" ");
        if (v.filter(w => !/^[A-ZÁÉÍÓÚÜÑa-záéíóúü0-9ñ.-:]{1,20}$/.test(w)).length > 0)
          throw new ValidationError("Debe ser uno o más nombres y/o dígitos.");
      },
    }
  )

  const prepareSubmitForm = data => ({
    ...data,
    Codigo: `V${data.Nombre.substring(0, 2)}${Math.random().toString(36).substring(2, 4)}`,
  })


  return <RecordsScreen formManager={formManager} controller={controller} 
    pageTitle="Enfermedades" prepareSubmitForm={prepareSubmitForm}
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
        name="Nombre"
        label="Nombre"
        placeholder="Use un nombre descriptivo" />
      {/* <DrawMap /> */}
    </>}
  />;
};
