import React, { useMemo } from 'react';
import { Endpoints } from '../../../Common/api/routes';
import { IPlantas } from '../../../Common/interfaces/models';
import { useCoontroller } from '../controllers/useController';
import { IArea } from '../../../Common/interfaces/models';
import { textFilter, selectFilter, numberFilter } from "react-bootstrap-table2-filter"
import { useFormManager } from '../hooks/useFormManager';
import { RecordsScreen } from '../components/RecordsScreen';


export const Plantas: React.FC = () => {
  const controller = useCoontroller<IPlantas>(Endpoints.Plantas)
  const { records } = controller

  const { records: allParents } = useCoontroller<IArea>(Endpoints.áreas)

  const parents = useMemo(() => {
    return records
      .sort((a1, a2) => a1.Codigo > a2.Codigo ? 1 : -1)
      .reduce((all, current) => {
        all[current.Id_Area] = { Codigo: current.Codigo_Area, id: current.Id_Area }
        return all
      }, {})
  }, [records])
  
  const columns = [
    {
      dataField: 'Id_Area',
      text: 'Área',
      sort: true,
      filter: selectFilter({
        // TODO Definir createSelectFilter
        options: Object.entries(parents)
          .reduce((all, [id, a]) => Object.assign(all, {[id]: a.Codigo}), {})
      }),
      formatter: (_, row) => parents[row.Id_Area].Codigo,
    },
    {
      dataField: 'Codigo',
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
    const parent = parents[initial?.Id_Area]
    return ({
      ...initial,
      Id_Area: initial?.Id_Area
        ? { label: parent?.Codigo, value: parent?.id }
        : { label: "<Seleccionar>", value: null },
      Codigo_Planta: initial?.Codigo_Planta || "",
      Nombre: initial?.Nombre || "",
      Circonferencia: initial?.Circonferencia || "",
      VisibleToStudent: initial?.VisibleToStudent,
    });
  };

  const formValidator: Object = {
    Id_Area: v => {
      if (!v?.value)
        throw new Error("Debe seleccionar una variedad");
    },
    // TODO Check for all codes not to be used
    Codigo_Planta: v => {
      v = v.split(/[^A-Za-z0-9]/)
      if (!/^P[0-9]+$/.test(v[0])) 
        throw new Error("Debe tener número de planta.")
      if (!/^F[0-9]+$/.test(v[1])) 
        throw new Error("Debe tener número de fila.")
    },
  };
  const formManager = useFormManager(reset, formValidator)

  const formFields = [
    {
      name: "Id_Area",
      label: "Área",
      bclass: "form-control",
      placeholder: "Seleccionar...",
      inputType: "select",
      options: allParents
        .map(a => ({
          label: a.Codigo,
          value: a.id,
        }))
    },
    {
      name: "Codigo_Planta",
      label: "Código de planta",
      bclass: "form-control",
      placeholder: "P11 F12",
    },
    {
      name: "Nombre",
      label: "Nombre",
      bclass: "form-control",
      placeholder: "Escriba el nombre",
    },
  ];
  return (
    <RecordsScreen pageTitle="Árboles de Mango"
      columns={columns} controller={controller} formManager={formManager}
      formFields={formFields}
    />
  )
}

