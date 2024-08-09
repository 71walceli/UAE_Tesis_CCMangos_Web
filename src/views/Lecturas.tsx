import React, { useEffect, useMemo, useState } from 'react';
import { selectFilter, dateFilter, numberFilter, multiSelectFilter } from 'react-bootstrap-table2-filter';

import { Endpoints } from '../../../Common/api/routes';
import { IArea } from '../../../Common/interfaces/models';
import { useCoontroller } from '../controllers/useController';
import { RecordsScreen } from '../components/RecordsScreen';
import { useFormManager, ValidationError } from '../hooks/useFormManager';
import { dateFormatter } from '../../../Common/helpers/formats';
import { FormField } from '../components/Form';


export const Lecturas: React.FC = () => {
  const { 
    ready: readyPlantas,
    findById: findPlantaById,
    selectOptions: selectPlantaOptions,
    filterOptions: filterPlantaOptions,
  } = useCoontroller(Endpoints.Plantas)
  
  const { 
    ready: readyEnfermedades,
    findById: findEnfermedadById,
    filterOptions: filterEnfermedadesOptions,
    selectOptions: selectEnfermedadesOptions,
  } = useCoontroller(Endpoints.enfermedad)

  const controller = useCoontroller<IArea>(Endpoints.Lectura)
  
  const columns = [
    {
      dataField: 'Id_Planta',
      text: 'Planta',
      sort: true,
      filter: selectFilter({
        options: filterPlantaOptions({
          getLabel: v => v.Codigo,
          getKey: v => v.id,
        }),
      }),
      formatter: v => findPlantaById(v).Codigo,
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
        options: filterEnfermedadesOptions({
          getLabel: v => v.Nombre,
          getKey: v => v.id,
        }),
      }),
      formatter: cell => cell
        .map(v => findEnfermedadById(v).Nombre)
        .reduce((acc, curr) => acc === null ? [curr] : [...acc, <br />, curr], null),
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
    const planta = findPlantaById(initial?.Id_Planta)

    return ({
      ...initial,
      Id_Planta: initial?.Id_Planta
        ? { label: planta?.Codigo, value: planta?.id }
        : null,
      CantidadInflorescencias: initial?.CantidadInflorescencias || "",
      CantidadFrutonIniciales: initial?.CantidadFrutonIniciales || "",
      CantidadFrutosMaduración: initial?.CantidadFrutosMaduración || "",
      CantidadInflorescenciasPerdidas: initial?.CantidadInflorescenciasPerdidas || "",
      Enfermedades: initial?.Enfermedades
        ? initial?.Enfermedades.map(id => ({ label: findEnfermedadById(id).Nombre, value: id }))
        : [],
      Observacion: initial?.Observacion || "",
      FechaVisita: dateFormatter(initial?.FechaVisita),
      FechaRegistro: dateFormatter(initial?.FechaRegistro),
      Activo: initial?.Activo || "",
      Id_Usuario: initial?.Id_Usuario || "",
      GUIDLectura: initial?.GUIDLectura || "",
      SyncId: initial?.SyncId || "",
    });
  };
  
  const validateInteger = v => {
    v = v ? Number(v) : null
    if (!v || v < 0) {
      throw new ValidationError("Debe ser número natural.")
    }
    if (!Number.isInteger(v)) {
      throw new ValidationError("Debe ser número natural.")
    }
  }
  const formValidator = {
    Id_Planta: v => {
      if (!v) {
        throw new ValidationError("Debe seleccionar una planta")
      }
    },
    CantidadInflorescencias: v => {
      v = validateInteger(v)
    },
    CantidadFrutonIniciales: v => {
      v = validateInteger(v)
    },
    CantidadFrutosMaduración: v => {
      v = validateInteger(v)
    },
    CantidadInflorescenciasPerdidas: v => {
      v = validateInteger(v)
    },
    fechaVisita: v => {
      if (!v) {
        throw new ValidationError("Debe indicar la fecha de la visita")
      }
    }
  }
  const formManager = useFormManager(reset, formValidator)

  const formFields = [
    {
      name: "Id_Planta",
      label: "Planta",
      inputType: "select",
      options: selectPlantaOptions(v => v.Codigo),
    },
    {
      name: "FechaVisita",
      label: "Fecha",
      placeholder: "Escriba el nombre",
      inputType: "date",
    },
    {
      name: "CantidadInflorescencias",
      label: "Cantidad de Inflorescencias",
      placeholder: "Ejemplo: 105",
      inputType: "number",
    },
    {
      name: "CantidadFrutonIniciales",
      label: "Cantidad de Frutos Iniciales",
      placeholder: "Ejemplo: 33",
      inputType: "number",
    },
    {
      name: "CantidadFrutosMaduración",
      label: "Cantidad de Frutos Maduros",
      label: "Nombre",
      placeholder: "Ejemplo: 24",
      inputType: "number",
    },
    {
      name: "CantidadInflorescenciasPerdidas",
      label: "Cantidad de Pérdidas",
      placeholder: "Ejemplo: 3",
      inputType: "number",
    },
    {
      name: "Enfermedades",
      label: "Enfermedades",
      placeholder: "Escriba el nombre",
      inputType: "select",
      multiple: true,
      options: selectEnfermedadesOptions(v => v.Nombre),
    },
    {
      name: "Observacion",
      label: "Observación",
      placeholder: "Ejemplo: Se observa una plaga en la planta",
      inputType: "textarea",
      lines: 5,
    },
  ];

  return (
    <RecordsScreen pageTitle="Controles de árbol" columns={columns} controller={controller} forbidCreate
      formManager={formManager}
      readiness={[controller.ready, readyEnfermedades, readyPlantas]}
      formFields__React={<>
        {formFields.map((props, index) => <FormField key={index} {...props} />)}
      </>}
    />
  );
};
