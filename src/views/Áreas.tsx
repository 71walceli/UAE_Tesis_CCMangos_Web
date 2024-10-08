import React, {  } from 'react';
import { textFilter, numberFilter } from 'react-bootstrap-table2-filter';

import { Endpoints } from '../../../Common/api/routes';
import { ILote } from '../../../Common/interfaces/models';
import { useCoontroller } from '../controllers/useController';
import { RecordsScreen } from '../components/RecordsScreen';
import { useFormManager, ValidationError } from '../hooks/useFormManager';
import { FormField } from '../components/Form';
import { DrawMap } from '../components/Map/LeafletMap/Leaflet/DrawMap';
import { getArea, getLength, parsePolygon } from '../../../Common/utils/polygons';
import { formatNumber } from '../../../Common/helpers/formats';


export const Áreas: React.FC = () => {
  const areasKey = "lotes"
  const controller = useCoontroller<ILote>(Endpoints[areasKey])
  
  const formManager = useFormManager(
    ((initial?: {
      Id_Proyecto: number;
      Codigo_Lote: string;
      Nombre: string;
      Variedad: number;
      Poligono: { lat: number; lng: number; }[];
    }) => {
      return ({
        ...initial,
        Id_Proyecto: initial?.Id_Proyecto || 1, // TODO Permitir seleccionar el proyecto
        Codigo_Lote: initial?.Codigo_Lote || "",
        Nombre: initial?.Nombre || "",
        Poligono: ![undefined, null, ""].includes(initial?.Poligono)
          ? {
            type: "polygon",
            points: parsePolygon(initial.Poligono),
            name: initial?.Codigo_Lote || "Esta área"
          }
          : null,
      });
    }), 
    {
      Codigo_Lote: async (v) => {
        if (v.substring(0, 1) !== "A")
          throw new ValidationError("Debe empezar con A.");
        if (!/^[A-Z0-9]+$/.test(v.substring(1)))
          throw new ValidationError("Selo mayúsculas y dígitos después de la A.");
        // TODO 10000 
        if (controller.findById(formManager.data.id)?.Codigo_Lote !== v && (await controller.checkCodeExists("lote", formManager.data.Codigo_Lote))) {
          throw new ValidationError("Ya existe ese código.");
        }
      },
      Nombre: v => {
        if (v.length < 5)
          throw new ValidationError("Al menos 5 caracteres");
        v = v.split(" ");
        if (v.filter(w => !/^[A-ZÁÉÍÓÚÜa-záéíóúü0-9.-:]{1,20}$/.test(w)).length > 0)
          throw new ValidationError("Debe ser uno o más nombres y/o dígitos.");
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

  return <RecordsScreen formManager={formManager} controller={controller} 
    pageTitle="Áreas" prepareSubmitForm={handleSubmit}
    columns={[
      {
        dataField: 'Codigo_Lote',
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
        dataField: 'Poligono',
        text: 'Área (ha)',
        sort: true,
        filter: numberFilter(),
        formatter: c => ![undefined, null, ""].includes(c) ? formatNumber(getArea(parsePolygon(c))/10000) : null,
      },
    ]} 
    formFields__React={<>
      <FormField
        name="Codigo_Lote"
        label="Código"
        placeholder="Ejemplo: A100" />
      <FormField
        name="Nombre"
        label="Nombre"
        placeholder="Ejemplo: Don Roberto 2" />
      <DrawMap name="Poligono" type="polygon" label="Ubibación en el mapa"
        otherRegions={controller.records
          .filter(r => r.Poligono && r.Poligono.trim() !== "")
          .filter(r => r.Codigo_Lote !== formManager.data.Codigo_Lote)
          .map(r => ({
            name: r.Codigo_Lote,
            points: parsePolygon(r.Poligono),
            color: "gray",
            type: "polygon",
          }))
        } 
      />
    </>}
  />;
};
