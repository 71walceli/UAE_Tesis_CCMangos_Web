import React, { useEffect } from 'react';
import { selectFilter, numberFilter, dateFilter, textFilter } from "react-bootstrap-table2-filter"

import { Endpoints } from '../../../Common/api/routes';
import { IProduccion, IArea } from '../../../Common/interfaces/models';
import { useCoontroller } from '../controllers/useController';
import { useFormManager, ValidationError } from '../hooks/useFormManager';
import { RecordsScreen } from '../components/RecordsScreen';
import { dateFormatter } from '../../../Common/helpers/formats';
import { FormField } from '../components/Form';
import { getArea, parsePolygon } from '../../../Common/utils/polygons';


export const Produccion: React.FC = () => {
  const controller = useCoontroller<IProduccion>(Endpoints.Produccion)
  const { 
    ready: readyLotes,
    filterOptions: filterLotesOptions,
    selectOptions: selectLotesOptions,
    findById: findLoteById,
  } = useCoontroller<IArea>(Endpoints.áreas)
  const { 
    ready: readyVariedades,
    findById: findVariedadById,
  } = useCoontroller<IArea>(Endpoints.variedad)
  
  const loteKey = "Id_Area"
  const columns = [
    {
      dataField: loteKey,
      text: 'Lote',
      sort: true,
      filter: selectFilter({ 
        // TODO Filter out unused codes
        options: filterLotesOptions({
          getKey: v => v.Codigo,
          getLabel: v => v.Codigo,
        })}
      ),
      formatter: (id: number) => findLoteById(id)?.Codigo,
    },
    {
      dataField: 'Fecha',
      text: 'Fecha',
      sort: true,
      filter: dateFilter({
        placeholder: "Buscar por fecha"
      })
    },
    {
      dataField: 'Cantidad',
      text: 'Cantidad (Kg)',
      sort: true,
      filter: numberFilter()
    },
    {
      dataField: 'Variedad',
      text: 'Variedad',
      sort: true,
      filter: textFilter(),
      formatter: variedad => variedad.Nombre,
    },
  ];
  
  const reset = (initial?: {
    [loteKey]: number;
    Cantidad: number;
    Fecha: Date;
    FechaRegistro: Date;
  }) => {
    const parentLote = initial?.[loteKey] ? findLoteById(initial[loteKey]) : null
    return ({
      ...initial,
      [loteKey]: parentLote?.Codigo
        ? { label: parentLote?.Codigo, value: parentLote?.id }
        : undefined,
      Cantidad: initial?.Cantidad || "",
      Fecha: dateFormatter(initial?.Fecha || new Date()),
      FechaRegistro: dateFormatter(initial?.FechaRegistro || new Date()),
      Id_Proyecto: 1,
      MinimaCosechaHectareaAnual: 0,
    });
  };

  const formValidator: Object = {
    // TODO Check for all codes not to be used
    [loteKey]: v => {
      if (!v?.value)
        throw new ValidationError("Debe seleccionar un lote");
    },
    // TODO Check for all codes not to be used
    Cantidad: (v, data) => {
      v = Number(v)
      if (Number.isNaN(v))
        throw new ValidationError("Número ivválido")
      // TODO Niveles de producción por hectárea
      if (v > data.MaximaCosechaHectareaAnual)
        throw new ValidationError(`La cantidad máxima permitida es de ${data.MaximaCosechaHectareaAnual} Kg.`)
      if (v < data.MinimaCosechaHectareaAnual)
        throw new ValidationError(`La cantidad mínima permitida es de ${data.MinimaCosechaHectareaAnual} Kg.`)
    },
  };
  const formManager = useFormManager(reset, formValidator)
  useEffect(() => {
    if (formManager.data[loteKey]) {
      const lote = findLoteById(formManager.data[loteKey]?.value);
      const veriedad = findVariedadById(lote?.Variedad);
      const hectareas = getArea(parsePolygon(lote?.Poligono)) / 10000
      
      formManager.set({
        ...formManager.data,
        Variedad: veriedad.Nombre,
        MaximaCosechaHectareaAnual: Number(veriedad.MaximaCosechaHectareaAnual) * hectareas,
        //MinimaCosechaHectareaAnual: Number(veriedad.MinimaCosechaHectareaAnual) * hectareas,
      })
    }
  }, [formManager.data[loteKey]])

  return <RecordsScreen pageTitle="Cosechas" 
    columns={columns} controller={controller} formManager={formManager} 
    readiness={[readyLotes, readyVariedades, controller.ready]}
    formFields__React={<>
      <FormField
        name={loteKey}
        label="Lote"
        type="select"
        options={selectLotesOptions(v => `${v.Codigo} ${v.Nombre}`)}
      />
      <FormField disabled
        name="Variedad"
        label="Variedad del lote"
        //value={findLoteById(formManager.data[loteKey])?.Variedad?.Nombre}
      />
      <FormField
        type="number"
        name="Cantidad"
        label="Cantidad cosechada (Kg)"
        placeholder='Ejemple: 12500'
      />
      <FormField
        type="date"
        name="Fecha"
        label="Fecha de cosecha"
      />
    </>}
  />
}
