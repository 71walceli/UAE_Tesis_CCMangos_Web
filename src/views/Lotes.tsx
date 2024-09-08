import React from 'react';
import { textFilter, selectFilter, numberFilter } from 'react-bootstrap-table2-filter';

import { Endpoints } from '../../../Common/api/routes';
import { IArea } from '../../../Common/interfaces/models';
import { useCoontroller } from '../controllers/useController';
import { RecordsScreen } from '../components/RecordsScreen';
import { useFormManager, ValidationError } from '../hooks/useFormManager';
import { DrawMap } from '../components/Map/LeafletMap/Leaflet/DrawMap';
import { getArea, getCenter, getLength, parsePolygon } from '../../../Common/utils/polygons';
import { FormField } from '../components/Form';
import { formatNumber } from '../../../Common/helpers/formats';


export const Lotes: React.FC = () => {
  const { 
    ready: areasReady,
    selectOptions: areaOptions, 
    findById: findAreaById, 
    records: allAreas,
    filterOptions: filterAreaOptions,
  } = useCoontroller(Endpoints.lotes)
  const { 
    ready: variedadesReady,
    selectOptions: variedadOptions, 
    findById: findVariedadById ,
    records: allVariedades,
  } = useCoontroller(Endpoints.variedad)

  const controller = useCoontroller<IArea>(Endpoints.áreas)
  
  const getNombreArea: any = v => `${v.Codigo_Lote} : ${v.Nombre}`;

  const formManager = useFormManager(
    ((initial?: {
      Id_Lote: number;
      Codigo_Area: string;
      Nombre: string;
      Variedad: number;
    }) => {
      const _variedad = initial?.Variedad ? findVariedadById(initial?.Variedad) : null;
      const _lote = initial?.Id_Lote ? findAreaById(initial?.Id_Lote) : null;
      return ({
        ...initial,
        Id_Lote: initial?.Id_Lote
          ? { label: getNombreArea(_lote), value: _lote?.id }
          : { label: "<Seleccionar>", value: null },
        Codigo_Area: initial?.Codigo_Area || "",
        Nombre: initial?.Nombre || "",
        Variedad: _variedad
          ? { label: _variedad.Nombre, value: _variedad.id }
          : { label: "<Seleccionar>", value: null },
        Poligono: ![undefined, null, ""].includes(initial?.Poligono)
          ? {
            type: "polygon",
            points: parsePolygon(initial.Poligono),
            name: initial?.Codigo_Area || "Esta área"
          }
          : null,
      });
    }), 
    {
      Id_Lote: async (v) => {
        if (!v?.value)
          throw new ValidationError("Debe seleccionar un lote.");
      },
      Codigo_Area: async (v) => {
        if (v.substring(0, 1) !== "L")
          throw new ValidationError("Debe empezar con L.");
        if (!/^[A-Z0-9]+$/.test(v.substring(1)))
          throw new ValidationError("Solo letras mayúsculas y dígitos después de la L.");
        if (controller.findById(formManager.data.id)?.Codigo_Area !== v
          && (await controller.checkCodeExists(
            "area", formManager.data.Codigo_Area,
            formManager.data.Id_Lote.value
            || formManager.data.Id_Lote
          ))) {
          throw new ValidationError("Ya existe ese código.");
        }
      },
      Nombre: v => {
        if (v.length < 5)
          throw new ValidationError("Al menos 5 caracteres");
        v = v.split(" ");
        if (v.filter(w => !/^[A-ZÁÉÍÓÚÜa-záéíóúü0-9.-:]{1,20}$/.test(w)).length > 0)
          throw new ValidationError("Uno o más nombres y/o dígitos.");
      },
      Variedad: v => {
        if (!v?.value)
          throw new ValidationError("Debe seleccionar una variedad");
      },
      Poligono: v => {
        if ((v?.points?.length || 0) < 3)
          throw new ValidationError("Debe estar definido en el mapa.");
      },
    }
  )

  const handleSubmit = (data) => ({
    ...data,
    Poligono: data.Poligono?.points.filter(coord => coord.lat && coord.lng)
      .map(coord => `${coord.lat}:${coord.lng}`).join(";"),
  })

  return (
    <RecordsScreen pageTitle="Lotes" controller={controller} prepareSubmitForm={handleSubmit}
      formManager={formManager} readiness={[areasReady, variedadesReady, controller.ready]}
      columns={[
        {
          dataField: 'Id_Lote',
          text: 'Área',
          sort: true,
          filter: selectFilter({
            options: filterAreaOptions({
              getLabel: v => `${v.Codigo_Lote} : ${v.Nombre}`,
              getKey: v => v.id,
            }),
          }),
          formatter: v => `${findAreaById(v).Codigo_Lote} : ${findAreaById(v).Nombre}`,
        },
        {
          dataField: 'Nombre',
          text: 'Nombre',
          sort: true,
          filter: textFilter(),
          formatter: (v, record) => `${record.Codigo_Area} : ${v}`,
        },
        {
          dataField: 'Variedad',
          text: 'Variedad',
          sort: true,
          filter: selectFilter({
            options: Object.entries(allVariedades)
              .reduce((all, [id, a]) => Object.assign(all, { [id]: a.Nombre }), {})
          }),
          formatter: id => findVariedadById(id).Nombre,
        },
        {
          dataField: 'Poligono',
          text: 'Área (ha)',
          sort: true,
          filter: numberFilter(),
          formatter: p => ![undefined, null, ""].includes(p)
            ? formatNumber(getArea(parsePolygon(p)) / 10000) : null,
        },
      ]} 
      formFields__React={<>
        <FormField
          name="Id_Lote"
          label="Área"
          inputType="select"
          options={areaOptions(getNombreArea)}
        />
        <FormField
          name="Codigo_Area"
          label="Código de área"
          placeholder="Ejemplo: L01"
        />
        <FormField
          name="Nombre"
          label="Nombre"
          placeholder="Ejemplo: Lote 1"
        />
        <FormField
          name="Variedad"
          label="Variedad"
          type="select"
          options={variedadOptions(v => v.Nombre)}
        />
        {formManager.data.Id_Lote?.value
          // TODO Add center to map based on area polygon
          ?<DrawMap name="Poligono" type="polygon" label="Ubicación en el mapa"
            center={getCenter(
              formManager.data.Poligono?.points
              || parsePolygon(
                findAreaById(formManager.data.Id_Lote.value).Poligono
              )
            )
            }
            otherRegions={[
              ...allAreas
                .filter(r => r.id === formManager.data.Id_Lote?.value)
                .filter(r => r.Poligono && r.Poligono.trim() !== "")
                .map(r => ({
                  name: r.Codigo_Lote,
                  points: parsePolygon(r.Poligono),
                  color: "cyan",
                  type: "polygon",
                })),
              ...controller.records
                .filter(r => r.Codigo_Lote === formManager.data.Codigo_Lote)
                .filter(r => r.Codigo_Area !== formManager.data.Codigo_Area)
                .filter(r => r.Poligono && r.Poligono.trim() !== "")
                .map(r => ({
                  name: r.Codigo_Area,
                  points: parsePolygon(r.Poligono),
                  color: "gray",
                  type: "polygon",
                })),
            ]}
          />
          :null
        }
      </>}
    />
  );
};
