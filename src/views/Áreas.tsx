import React, {  } from 'react';
import { Endpoints } from '../../../Common/api/routes';
import { IArea, ILote } from '../../../Common/interfaces/models';
import { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import { useCoontroller } from '../controllers/useController';
import { RecordsScreen } from '../components/RecordsScreen';
import { useFormManager } from '../hooks/useFormManager';


export const Áreas: React.FC = () => {
  const { records, findById } = useCoontroller<ILote>(Endpoints.lotes)
  const controller = useCoontroller<IArea>(Endpoints.áreas)
  
  const variedades = [
    "Ataulfo",
    "Kent",
    "Tommy Atkins",
  ]
  const columns = [
    {
      dataField: 'Id_Lote',
      text: 'Lote',
      sort: true,
      filter: selectFilter({
        options: records.reduce((o, v) => Object.assign(o, {[v.id]: v.Codigo_Lote}), {})
      }),
      formatter: (_, row) => findById(row.Id_Lote).Codigo_Lote
    },
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
      dataField: 'Variedad',
      text: 'Variedad',
      sort: true,
      filter: selectFilter({
        options: variedades.reduce((o, v) => Object.assign(o, {[v]: v}), {})
      }),
    },
  ];

  const reset = (initial?: {
    Id_Lote: number;
    Codigo_Area: string;
    Nombre: string;
    Variedad: string;
  }) => {
    const lote = findById(initial?.Id_Lote)
    return ({
      ...initial,
      Id_Lote: initial?.Id_Lote
        ? { label: lote?.Codigo_Lote, value: lote?.id }
        : { label: "<Seleccionar>", value: null },
      Codigo_Area: initial?.Codigo_Area || "",
      Nombre: initial?.Nombre || "",
      Variedad: initial?.Variedad
        ? { label: initial?.Variedad, value: initial?.Variedad }
        : { label: "<Seleccionar>", value: "" },
    });
  };
  
  const formManager = useFormManager(reset)

  return (
    <RecordsScreen columns={columns} controller={controller} 
      formManager={formManager}
      formFields={[
        {
          name: "Id_Lote",
          label: "Lote",
          bclass: "form-control",
          placeholder: "Indique el lote",
          inputType:"select",
          options: records
            .sort((l1, l2) => l1.Codigo_Lote > l2.Codigo_Lote ? 1 : -1)
            .map(v => ({
              label: v.Codigo_Lote,
              value: v.id,
            }))
        },
        {
          name: "Codigo_Area",
          label: "Código de área",
          bclass: "form-control",
          placeholder: "Escriba el código de área",
        },
        {
          name: "Nombre",
          label: "Nombre",
          bclass: "form-control",
          placeholder: "Escriba el nombre",
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
