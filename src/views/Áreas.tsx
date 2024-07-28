import React, {  } from 'react';
import { textFilter, selectFilter, numberFilter } from 'react-bootstrap-table2-filter';

import { Endpoints } from '../../../Common/api/routes';
import { ILote } from '../../../Common/interfaces/models';
import { useCoontroller } from '../controllers/useController';
import { RecordsScreen } from '../components/RecordsScreen';
import { useFormManager, ValidationError } from '../hooks/useFormManager';
import { FormField } from '../components/Form';
import { DrawMap } from '../components/Map/LeafletMap/Leaflet/DrawMap';
import { getArea, getLength, parsePolygon } from '../../../Common/utils/polygons';


export const Áreas: React.FC = () => {
  const controller = useCoontroller<ILote>(Endpoints.lotes)
  
  const reset = (initial?: {
    Id_Proyecto: number;
    Codigo_Lote: string;
    Nombre: string;
    Variedad: number;
    Poligono: {lat: number, lng: number}[];
  }) => {
    return ({
      ...initial,
      Id_Proyecto: initial?.Id_Proyecto || 1, // TODO Permitir seleccionar el proyecto
      Codigo_Lote: initial?.Codigo_Lote || "",
      Nombre: initial?.Nombre || "",
      Poligono: 
        ![undefined, null, ""].includes(initial?.Poligono)
          ?{points: parsePolygon(initial.Poligono), name: initial?.Codigo_Lote || "Esta área"}
          :null
        ,
    });
  };
  
  const formValidator: Object = {
    Codigo_Lote: async v => {
      if (v.substring(0,1) !== "A") 
        throw new ValidationError("Cada lote debe empezar con L.")
      if (!/^[A-Z0-9]+$/.test(v.substring(1))) 
        throw new ValidationError("Debe tener una abreviatura en mayúsculas y terminar con un número.")
      // TODO 10000 
      if (controller.findById(formManager.data.id)?.Codigo_Lote !== v && (await controller.checkCodeExists("lote", formManager.data.Codigo_Lote))) {
        throw new ValidationError("Ya existe un área con ese código.")
      }
    },
    Nombre: v => {
      if (v.length < 5) 
        throw new ValidationError("Al menos 5 caracteres")
      v = v.split(" ")
      if (v.filter(w => !/^[A-ZÁÉÍÓÚÜa-záéíóúü0-9.-:]{1,20}$/.test(w)).length > 0) 
        throw new ValidationError("Debe ser uno o más nombres y/o dígitos.")
    },
    Poligono: v => {
      if ((v?.points?.length || 0) < 3) 
        throw new ValidationError("Debe tener al menos 3 puntos para encerrar un área.")
    },
  };
  const formManager = useFormManager(reset, formValidator)

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
        formatter: c => ![undefined, null, ""].includes(c) ? getArea(parsePolygon(c))/10000 : null,
      },
      {
        dataField: 'Poligono',
        text: 'Perímetro (km)',
        sort: true,
        filter: numberFilter(),
        formatter: c => ![undefined, null, ""].includes(c) ? getLength(parsePolygon(c)) : null,
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
        placeholder="Use un nombre descriptivo" />
      <DrawMap name="Poligono" 
        otherRegions={controller.records
          .filter(r => r.Poligono && r.Poligono.trim() !== "")
          .filter(r => r.Codigo_Lote !== formManager.data.Codigo_Lote)
          .map(r => ({
            name: r.Codigo_Lote,
            points: parsePolygon(r.Poligono),
            color: "gray",
          }))
      } 
      />
    </>}
  />;
};
