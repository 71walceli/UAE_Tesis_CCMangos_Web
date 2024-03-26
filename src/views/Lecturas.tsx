import React, { useMemo } from 'react';
import { textFilter, selectFilter, dateFilter, numberFilter, multiSelectFilter } from 'react-bootstrap-table2-filter';

import { Endpoints } from '../../../Common/api/routes';
import { IArea } from '../../../Common/interfaces/models';
import { useCoontroller } from '../controllers/useController';
import { RecordsScreen } from '../components/RecordsScreen';
import { useFormManager } from '../hooks/useFormManager';
import { dateFormatter } from '../../../Common/helpers/formats';


export const Lecturas: React.FC = () => {
  const controller = useCoontroller<IArea>(Endpoints.Lectura)

  const { records: _enfermedades } = useCoontroller(Endpoints.enfermedad)
  const enfermedades = useMemo(() => {
    return _enfermedades
      .sort((a1, a2) => a1.Codigo > a2.Codigo ? 1 : -1)
      .reduce((all, current) => {
        all[current.id] = { Codigo: current.Codigo, id: current.id }
        return all
      }, {})
  }, [_enfermedades])

  const { records: _plantas } = useCoontroller(Endpoints.Plantas)
  const plantas = useMemo(() => {
    return _plantas
      .sort((a1, a2) => a1.Codigo > a2.Codigo ? 1 : -1)
      .reduce((all, current) => {
        all[current.id] = { Codigo: current.Codigo, id: current.id }
        return all
      }, {})
  }, [_plantas])

  const columns = [
    {
      dataField: 'Id_Planta',
      text: 'Planta',
      sort: true,
      filter: selectFilter({
        options: Object.entries(plantas)
          .reduce((all, [id, a]) => Object.assign(all, {[id]: a.Codigo}), {})
      }),
      formatter: (_, row) => plantas[row.Id_Planta]?.Codigo,
    },
    {
      dataField: 'CantidadInflorescencias',
      text: '# Flores',
      sort: true,
      filter: numberFilter(),
    },
    {
      dataField: 'CantidadFrutonIniciales',
      text: '# Frutos',
      sort: true,
      filter: numberFilter(),
    },
    {
      dataField: 'CantidadFrutosMaduración',
      text: '# Maduros',
      sort: true,
      filter: numberFilter(),
    },
    {
      dataField: 'CantidadInflorescenciasPerdidas',
      text: '# Pérdidas',
      sort: true,
      filter: numberFilter(),
    },
    {
      dataField: 'Enfermedades',
      text: 'Enfermedades',
      sort: true,
      filter: multiSelectFilter({
        options: Object.entries(enfermedades)
          .reduce((all, [id, a]) => Object.assign(all, {[id]: a.Codigo}), {})
      }),
    },
    {
      dataField: 'FechaVisita',
      text: 'Fecha',
      sort: true,
      filter: dateFilter(),
      formatter: (cell) => dateFormatter(cell),
    },
  ];

  const reset = (initial?: {
    Id_Planta: number;
    CantidadInflorescencias: number;
    CantidadFrutonIniciales: number;
    CantidadFrutosMaduración: number;
    CantidadInflorescenciasPerdidas: number;
    Enfermedades: number[];
    Observacion: string;
    FechaVisita: Date;
    FechaRegistro: Date;
    Activo: boolean;
    Id_Usuario: number;
    GUIDLectura: string;
    SyncId: string;
  }) => {
    const planta = plantas[initial?.Id_Planta]
    return ({
      ...initial,
      Id_Planta: initial?.Id_Planta
        ? { label: planta?.Codigo, value: planta?.id }
        : null,
      CantidadInflorescencias: initial?.CantidadInflorescencias || "",
      CantidadFrutonIniciales: initial?.CantidadFrutonIniciales || "",
      CantidadFrutosMaduración: initial?.CantidadFrutosMaduración || "",
      CantidadInflorescenciasPerdidas: initial?.CantidadInflorescenciasPerdidas || "",
      Enfermedades: initial?.Enfermedades || [],
      Observacion: initial?.Observacion || "",
      FechaVisita: dateFormatter(initial?.FechaVisita),
      FechaRegistro: dateFormatter(initial?.FechaRegistro),
      Activo: initial?.Activo || "",
      Id_Usuario: initial?.Id_Usuario || "",
      GUIDLectura: initial?.GUIDLectura || "",
      SyncId: initial?.SyncId || "",
    });
  };
  
  const formManager = useFormManager(reset)

  const formFields = [
    {
      name: "Id_Planta",
      label: "Planta",
      bclass: "form-control",
      placeholder: "Indique el lote",
      inputType: "select",
      options: _plantas
        .map(v => ({
          label: `Planta ${v.Codigo}`,
          value: v.id,
        }))
    },
    {
      name: "CantidadInflorescencias",
      label: "Cantidad de Inflorescencias",
      bclass: "form-control",
      placeholder: "Escriba el código de área",
      inputType: "number",
    },
    {
      name: "CantidadFrutonIniciales",
      label: "Cantidad de Frutos Iniciales",
      bclass: "form-control",
      placeholder: "Escriba el nombre",
      inputType: "number",
    },
    {
      name: "CantidadFrutosMaduración",
      label: "Cantidad de Frutos Maduros",
      label: "Nombre",
      bclass: "form-control",
      placeholder: "Escriba el nombre",
      inputType: "number",
    },
    {
      name: "CantidadInflorescenciasPerdidas",
      label: "Cantidad de Pérdidas",
      bclass: "form-control",
      placeholder: "Escriba el nombre",
      inputType: "number",
    },
    {
      name: "Enfermedades",
      label: "Enfermedades",
      bclass: "form-control",
      placeholder: "Escriba el nombre",
      inputType: "list",
      multipleChoice: true,
      options: _enfermedades
        .map(v => ({
          label: `${v.Nombre}`,
          value: v.id,
        })),
      value: formManager.data.enfermedades,
    },
    {
      name: "Observacion",
      label: "Nombre",
      bclass: "form-control",
      placeholder: "Escriba el nombre",
      inputType: "textarea",
    },
    {
      name: "FechaVisita",
      label: "Nombre",
      bclass: "form-control",
      placeholder: "Escriba el nombre",
      inputType: "date",
    },
    {
      name: "FechaRegistro",
      label: "Nombre",
      bclass: "form-control",
      placeholder: "Escriba el nombre",
      inputType: "date",
    },
  ];

  return (
    <RecordsScreen pageTitle="Lotes" columns={columns} controller={controller} forbidCreate
      formManager={formManager}
      formFields={formFields} 
    />
  );
};
