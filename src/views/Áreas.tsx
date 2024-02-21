import React, { useMemo } from 'react';
import { Endpoints } from '../../../Common/api/routes';
import { IArea } from '../../../Common/interfaces/models';
import { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import { useCoontroller } from '../controllers/useController';
import { RecordsScreen } from '../components/RecordsScreen';
import { useFormManager } from '../hooks/useFormManager';


export const Áreas: React.FC = () => {
  const controller = useCoontroller<IArea>(Endpoints.áreas)
  const { records } = controller

  const { records: allParents } = useCoontroller<IArea>(Endpoints.áreas)

  const parents = useMemo(() => {
    return records
      .sort((a1, a2) => a1.Codigo > a2.Codigo ? 1 : -1)
      .reduce((all, current) => {
        all[current.Id_Lote] = { Codigo: current.Codigo_Lote, id: current.Id_Lote }
        return all
      }, {})
  }, [records])

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
        // TODO Definir createSelectFilter
        options: Object.entries(parents)
          .reduce((all, [id, a]) => Object.assign(all, {[id]: a.Codigo}), {})
      }),
      formatter: (_, row) => {
        const newLocal = parents[row.Id_Lote];
        console.log(newLocal)
        return newLocal.Codigo;
      },
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
    const lote = parents[initial?.Id_Lote]
    return ({
      ...initial,
      Id_Lote: initial?.Id_Lote
        ? { label: lote?.Codigo, value: lote?.id }
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
    <RecordsScreen pageTitle="Áreas" columns={columns} controller={controller} 
      formManager={formManager}
      formFields={[
        {
          name: "Id_Lote",
          label: "Lote",
          bclass: "form-control",
          placeholder: "Indique el lote",
          inputType:"select",
          options: allParents
            .map(v => ({
              label: v.Codigo,
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
