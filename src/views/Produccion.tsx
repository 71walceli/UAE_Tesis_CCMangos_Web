import React, { useEffect } from 'react';
import { selectFilter, numberFilter, dateFilter, textFilter } from "react-bootstrap-table2-filter"

import { Endpoints } from '../../../Common/api/routes';
import { IProduccion, IArea } from '../../../Common/interfaces/models';
import { useCoontroller } from '../controllers/useController';
import { useFormManager, ValidationError } from '../hooks/useFormManager';
import { RecordsScreen } from '../components/RecordsScreen';
import { dateFormatter, formatNumber } from '../../../Common/helpers/formats';
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
  
  const formManager = useFormManager(
    ((initial?: {
      [loteKey]: number;
      Cantidad: number;
      Fecha: Date;
      FechaRegistro: Date;
    }) => {
      const parentLote = initial?.[loteKey] ? findLoteById(initial[loteKey]) : null;
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
        Hectáreas: "",
      });
    }), 
    {
      // TODO Check for all codes not to be used
      [loteKey]: v => {
        if (!v?.value)
          throw new ValidationError("Debe seleccionar un lote");
      },
      // TODO Check for all codes not to be used
      Cantidad: (v, data) => {
        v = Number(v);
        if (Number.isNaN(v))
          throw new ValidationError("Número ivválido");
        // TODO Niveles de producción por hectárea
        if (v > data.MaximaCosechaHectareaAnual)
          throw new ValidationError(`La cantidad máxima permitida es de ${data.MaximaCosechaHectareaAnual} Kg.`);
        if (v < data.MinimaCosechaHectareaAnual)
          throw new ValidationError(`La cantidad mínima permitida es de ${data.MinimaCosechaHectareaAnual} Kg.`);
      },
    }
  )
  
  useEffect(() => {
    if (formManager.data[loteKey]) {
      const lote = findLoteById(formManager.data[loteKey]?.value);
      const veriedad = findVariedadById(lote?.Variedad);
      const hectareas = getArea(parsePolygon(lote?.Poligono)) / 10000
      
      formManager.set({
        ...formManager.data,
        Variedad: veriedad.Nombre,
        MaximaCosechaHectareaAnual: Number(veriedad.MaximaCosechaHectareaAnual) * hectareas,
        Hectareas: hectareas,
      })
    }
  }, [formManager.data[loteKey]])

  return <RecordsScreen pageTitle="Cosechas" 
    controller={controller} formManager={formManager} 
    readiness={[readyLotes, readyVariedades, controller.ready]}
    columns={[
      {
        dataField: loteKey,
        text: 'Lote',
        sort: true,
        filter: selectFilter({
          options: filterLotesOptions({
            getLabel: v => `${v.Codigo} : ${v.NombreCompleto}`,
            getKey: v => v.id,
          })
        }
        ),
        formatter: (id: number) => `${findLoteById(id)?.Codigo} ${findLoteById(id)?.NombreCompleto}`,
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
    ]}
    formFields__React={<>
      <FormField
        name={loteKey}
        label="Lote"
        type="select"
        options={selectLotesOptions(v => `${v.Codigo} : ${v.NombreCompleto}`)}
      />
      <FormField disabled
        name="Variedad"
        label="Variedad del lote"
      />
      <FormField disabled
        name="Hectareas"
        label="Área (hectáreas)"
        value={formatNumber(formManager.data.Hectareas)}
      />
      <FormField disabled
        name="MaximaCosechaHectareaAnual"
        label="Máxima Cosecha Anual"
        value={formatNumber(formManager.data.MaximaCosechaHectareaAnual)}
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
