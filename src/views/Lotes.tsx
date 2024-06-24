import React, {  } from 'react';
import { Endpoints } from '../../../Common/api/routes';
import { ILote } from '../../../Common/interfaces/models';
import { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import { useCoontroller } from '../controllers/useController';
import { RecordsScreen } from '../components/RecordsScreen';
import { useFormManager } from '../hooks/useFormManager';


export const Lotes: React.FC = () => {
  const controller = useCoontroller<ILote>(Endpoints.lotes)
  
  const variedades = [
    "Ataulfo",
    "Kent",
    "Tommy Atkins",
  ]
  const columns = [
    {
      dataField: 'Codigo_Lote',
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
      dataField: 'Variedad',
      text: 'Variedad',
      sort: true,
      filter: selectFilter({
        options: variedades.reduce((o, v) => Object.assign(o, {[v]: v}), {})
      }),
    },
  ];
  
  const reset = (initial?: {
    Id_Proyecto: number;
    Codigo_Lote: string;
    Nombre: string;
    Variedad: string;
  }) => ({
    ...initial,
    Id_Proyecto: initial?.Id_Proyecto || 1, // TODO Permitir seleccionar el proyecto
    Codigo_Lote: initial?.Codigo_Lote || "",
    Nombre: initial?.Nombre || "",
    Variedad: initial?.Variedad
      ? { label: initial?.Variedad, value: initial?.Variedad } 
      : { label: "<Seleccionar>", value: "" },
  });
  
  const formValidator: Object = {
    Codigo_Lote: v => {
      if (v.substring(0,1) !== "A") 
        throw new Error("Cada lote debe empezar con L.")
      if (!/^[A-Z0-9]+$/.test(v.substring(1))) 
        throw new Error("Debe tener una abreviatura en mayúsculas y terminar con un número.")
      // TODO Check for all codes not to be used
    },
    Nombre: v => {
      if (v.length < 5) 
        throw new Error("Al menos 5 caracteres")
      v = v.split(" ")
      if (v.filter(w => !/^[A-ZÁÉÍÓÚÜa-záéíóúü0-9.-:]{1,20}$/.test(w)).length > 0) 
        throw new Error("Debe ser uno o más nombres y/o dígitos.")
    },
    Variedad: v => {
      if (!v?.value)
        throw new Error("Debe seleccionar una variedad");
    },
  };
  const formManager = useFormManager(reset, formValidator)

  const formFields = [
    {
      name: "Codigo_Lote",
      label: "Código",
      bclass: "form-control",
      placeholder: "A100",
    },
    {
      name: "Nombre",
      label: "Nombre",
      bclass: "form-control",
      placeholder: "Nombre descriptivo",
    },
    {
      name: "Variedad",
      label: "Variedad",
      bclass: "form-control",
      placeholder: "Seleccionar...",
      inputType: "select",
      options: variedades.map(v => ({
        label: v,
        value: v,
      })),
    },
  ];
  return (
    <RecordsScreen pageTitle="Áreas" columns={columns} controller={controller}
      formManager={formManager}
      formFields={formFields}
    />
  );
};
