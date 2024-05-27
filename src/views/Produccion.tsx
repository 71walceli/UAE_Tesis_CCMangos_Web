import React, { useMemo } from 'react';
import { selectFilter, numberFilter, dateFilter } from "react-bootstrap-table2-filter"

import { Endpoints } from '../../../Common/api/routes';
import { ILote, IPlantas } from '../../../Common/interfaces/models';
import { useCoontroller } from '../controllers/useController';
import { IArea } from '../../../Common/interfaces/models';
import { useFormManager } from '../hooks/useFormManager';
import { RecordsScreen } from '../components/RecordsScreen';
import { format } from 'date-fns';
import { dateFormatter } from '../../../Common/helpers/formats';


export const Produccion: React.FC = () => {
  const controller = useCoontroller<IPlantas>(Endpoints.Produccion)
  //const { records } = controller

  const { records: _areasParents } = useCoontroller<IArea>(Endpoints.áreas)
  const areasParents = useMemo(() => {
    return Object.assign(_areasParents
      .sort((a1, a2) => a1.Codigo > a2.Codigo ? 1 : -1)
      .reduce((all, current) => {
        all[current.id] = { Codigo: current.Codigo_Area, id: current.id }
        return all
      }, {}))
  }, [_areasParents])
  
  const { records: _lotesParents } = useCoontroller<ILote>(Endpoints.lotes)
  const lotesParents = useMemo(() => {
    return Object.assign(_lotesParents
      .sort((a1, a2) => a1.Codigo > a2.Codigo ? 1 : -1)
      .reduce((all, current) => {
        all[current.id] = { Codigo: current.Codigo_Lote, id: current.id }
        return all
      }, {}))
  }, [_lotesParents])

  const columns = [
    {
      dataField: 'Id_Lote',
      text: 'Area',
      sort: true,
      filter: selectFilter({
        // TODO Definir createSelectFilter
        options: Object.entries(lotesParents)
          .reduce((all, [id, a]) => Object.assign(all, {[id]: a.Codigo}), {})
      }),
      formatter: (_, row) => lotesParents[row.Id_Lote]?.Codigo,
    },
    {
      dataField: 'Id_Area',
      text: 'Lote',
      sort: true,
      filter: selectFilter({
        // TODO Definir createSelectFilter
        options: Object.entries(areasParents)
          .reduce((all, [id, a]) => Object.assign(all, {[id]: a.Codigo}), {})
      }),
      formatter: (_, row) => areasParents[row.Id_Area]?.Codigo,
    },
    {
      dataField: 'Cantidad',
      text: 'Cantidad',
      sort: true,
      filter: numberFilter()
    },
    {
      dataField: 'Fecha',
      text: 'Fecha',
      sort: true,
      filter: dateFilter({
        placeholder: "Buscar por fecha"
      })
    },
    // Agrega más columnas según sea necesario
  ];
  
  const reset = (initial?: {
    Id_Area: number;
    Id_Lote: number;
    Cantidad: number;
    Fecha: Date;
    FechaRegistro: Date;
  }) => {
    const parentArea = areasParents[initial?.Id_Area]
    const parentLote = lotesParents[initial?.Id_Lote]
    return ({
      ...initial,
      Id_Area: parentArea?.Codigo
        ? { label: parentArea?.Codigo, value: parentArea?.id }
        : undefined,
      Id_Lote: parentLote?.Codigo
        ? { label: parentLote?.Codigo, value: parentLote?.id }
        : undefined,
      Cantidad: initial?.Cantidad || "",
      Fecha: dateFormatter(initial?.Fecha || new Date()),
      FechaRegistro: dateFormatter(initial?.FechaRegistro || new Date()),
      Id_Proyecto: 1,
    });
  };

  const formManager = useFormManager(reset);

  const formFields = [
    {
      name: "Id_Lote",
      label: "Área",
      bclass: "form-control",
      placeholder: "Indique el área",
      inputType: "select",
      options: _lotesParents
        .map(a => ({
          label: a.Codigo_Lote,
          value: a.id,
        }))
    },
    {
      name: "Id_Area",
      label: "Lote",
      bclass: "form-control",
      placeholder: "Indique el lote",
      inputType: "select",
      options: _areasParents
        .map(a => ({
          label: a.Codigo,
          value: a.id,
        }))
    },
    {
      name: "Cantidad",
      label: "Cantidad cosechada",
      bclass: "form-control",
      placeholder: "Escriba el código de planta",
      inputType: "number",
    },
    {
      name: "Fecha",
      label: "Fecha",
      bclass: "form-control",
      placeholder: "Escriba el código de planta",
      inputType: "date",
    },
  ];
  return (
    <RecordsScreen pageTitle="Cosechas"
      columns={columns} controller={controller} formManager={formManager}
      formFields={formFields}
    />
  )
}

