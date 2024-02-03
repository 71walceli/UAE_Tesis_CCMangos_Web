import React, {  } from 'react';
import { Endpoints } from '../../../Common/api/routes';
import { IPlantas } from '../../../Common/interfaces/models';
import { useCoontroller } from '../controllers/useController';
import { IArea } from '../../../Common/interfaces/models';
import { textFilter, selectFilter, numberFilter } from "react-bootstrap-table2-filter"
import { useFormManager } from '../hooks/useFormManager';
import { RecordsScreen } from '../components/RecordsScreen';


export const Plantas = () => {
  const { records, findById } = useCoontroller<IArea>(Endpoints.áreas)
  const controller = useCoontroller<IPlantas>(Endpoints.Plantas)

  const columns = [
    {
      dataField: 'Id_Area',
      text: 'Área',
      sort: true,
      filter: selectFilter({
        options: records.reduce((o, v) => Object.assign(o, {[v.id]: v.Codigo_Area}), {})
      }),
      formatter: (_, row) => findById(row.Id_Area)?.Codigo_Area,
    },
    {
      dataField: 'Codigo_Planta',
      text: 'Código',
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'Nombre',
      text: 'Nombre',
      sort: true,
      filter: textFilter({
        placeholder: "Buscar por nombre"
      })
    },
    {
      dataField: 'Circunferencia',
      text: 'Circunferencia',
      sort: true,
      filter: numberFilter(),
      formatter: (_, row) => Number(row.Circunferencia),
      type: "number",
    },
    {
      dataField: 'VisibleToStudent',
      text: 'Visible para Estudiante',
      sort: true,
      filter: textFilter(),
      formatter: (_, row) => row.VisibleToStudent ? "Sí" : "No",
    },
    // Agrega más columnas según sea necesario
  ];
  
  const reset = (initial?: {
    Id_Area: number;
    Codigo_Planta: string;
    Nombre: string;
    Circonferencia: number;
    VisibleToStudent: boolean;
  }) => {
    const parent = findById(initial?.Id_Area)
    return ({
      ...initial,
      Id_Area: initial?.Id_Area
        ? { label: parent?.Codigo_Area, value: parent?.id }
        : { label: "<Seleccionar>", value: null },
      Codigo_Planta: initial?.Codigo_Planta || "",
      Nombre: initial?.Nombre || "",
      Circonferencia: initial?.Circonferencia || "",
      VisibleToStudent: initial?.VisibleToStudent,
    });
  };

  const formManager = useFormManager(reset);

  return (
    <RecordsScreen columns={columns} controller={controller} formManager={formManager}
      formFields={[
        {
          name: "Id_Area",
          label: "Área",
          bclass: "form-control",
          placeholder: "Indique el lote",
          inputType:"select",
          options: records
            .sort((l1, l2) => l1.Codigo_Area > l2.Codigo_Area ? 1 : -1)
            .map(v => ({
              label: v.Codigo_Area,
              value: v.id,
            }))
        },
        {
          name: "Codigo_Planta",
          label: "Código de planta",
          bclass: "form-control",
          placeholder: "Escriba el código de planta",
        },
        {
          name: "Nombre",
          label: "Nombre",
          bclass: "form-control",
          placeholder: "Escriba el nombre",
        },
        {
          name: "Circunferencia",
          label: "Circunferencia",
          bclass: "form-control",
          placeholder: "Ingrese la circunferencia",
          inputType:"number",
          min: 0,
          max: 20,
          step: 0.1,
        },
        {
          name: "VisibleToStudent",
          label: "Visible para estudiantes",
          bclass: "form-checkbox",
          inputType:"checkbox",
        },
        // TODO Agregar mapa
      ]}
    />
  )
}

