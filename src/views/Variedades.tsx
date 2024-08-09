import React, {  } from 'react';
import { textFilter, numberFilter } from 'react-bootstrap-table2-filter';

import { Endpoints } from '../../../Common/api/routes';
import { ILote } from '../../../Common/interfaces/models';
import { useCoontroller } from '../controllers/useController';
import { RecordsScreen } from '../components/RecordsScreen';
import { useFormManager, ValidationError } from '../hooks/useFormManager';
import { FormField } from '../components/Form';


export const Variedad: React.FC = () => {
  const controller = useCoontroller<ILote>(Endpoints.variedad)
  
  // TODO Remove code
  const reset = (initial?: {
    Codigo: string;
    Nombre: string;
    Variedad: string;
    MaximaCosechaHectareaAnual: string;
    MinimaCosechaHectareaAnual: string;
  }) => ({
    ...initial,
    Codigo: initial?.Codigo || "",
    Nombre: initial?.Nombre || "",
    Variedad: initial?.Variedad
      ? { label: initial?.Variedad, value: initial?.Variedad } 
      : { label: "<Seleccionar>", value: "" },
    MaximaCosechaHectareaAnual: initial?.MaximaCosechaHectareaAnual || "",
    MinimaCosechaHectareaAnual: initial?.MinimaCosechaHectareaAnual || "",
  });
  
  const formValidator: Object = {
    Nombre: v => {
      if (v.length < 5) 
        throw new ValidationError("Al menos 5 caracteres")
      v = v.split(" ")
      if (v.filter(w => !/^[A-ZÁÉÍÓÚÜÑa-záéíóúüñ0-9.-:]{1,20}$/.test(w)).length > 0) 
        throw new ValidationError("Debe ser uno o más nombres y/o dígitos.")
    },
    MaximaCosechaHectareaAnual: (v, data) => {
      if (Number(v) <= 0 || v.includes("e"))
        throw new ValidationError("Debe ser un número mayor a 0.")
      let minValue = Number(data.MinimaCosechaHectareaAnual);
      minValue = !Number.isNaN(minValue) ? minValue : Number.MAX_VALUE
      console.log({minValue, data})
      if (Number(v) <= minValue)
        throw new ValidationError("No puede ser ignal o menor que el mínimo")
    },
    MinimaCosechaHectareaAnual: v => {
      if (Number(v) <= 0 || v.includes("e"))
        throw new ValidationError("Debe ser un número mayor a 0.")
    },
  };
  const formManager = useFormManager(reset, formValidator)

  const prepareSubmitForm = data => ({
    ...data,
    Codigo: `V${data.Nombre.substring(0, 2)}${Math.random().toString(36).substring(2, 4)}`,
  })

  return <RecordsScreen formManager={formManager} controller={controller} 
    prepareSubmitForm={prepareSubmitForm}
    pageTitle="Variedad" 
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
      {
        text: 'Max. Kg/Ha/Año',
        dataField: 'MaximaCosechaHectareaAnual',
        sort: true,
        filter: numberFilter(),
      },
    ]} 
    formFields__React={<>
      {/* <FormField
        name="Codigo"
        label="Código"
        placeholder="Ejemplo: A100" /> */}
      <FormField
        name="Nombre"
        label="Nombre"
        placeholder="Use un nombre descriptivo" />
      <FormField
        name="MaximaCosechaHectareaAnual"
        type="number"
        label="Maxima en cosecha anual por Hectarea (Kg)"
        placeholder="Ejemplo: 100" />
      {/* <DrawMap /> */}
    </>}
  />;
};
