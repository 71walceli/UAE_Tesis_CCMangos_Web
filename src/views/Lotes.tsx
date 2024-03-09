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
  
  const formManager = useFormManager(reset)

  return (
    <RecordsScreen pageTitle="Áreas" columns={columns} controller={controller}
      formManager={formManager}
      formFields={[
        {
          name: "Codigo_Lote",
          label: "Código",
          bclass: "form-control",
          placeholder: "Ingrese el código",
        },
        {
          name: "Nombre",
          label: "Nombre",
          bclass: "form-control",
          placeholder: "Escriba el nombre del lote",
        },
        {
          name: "Variedad",
          label: "Variedad",
          bclass: "form-control",
          placeholder: "Ingrese el código",
          inputType:"select",
          options: variedades.map(v => ({
            label: v,
            value: v,
          })),
        },
        // TODO Agregar mapa
      ]} 
    />
  );
};
