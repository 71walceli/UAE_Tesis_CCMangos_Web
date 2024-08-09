import React, { useMemo } from 'react';
import { textFilter, selectFilter, numberFilter } from "react-bootstrap-table2-filter"

import { Endpoints } from '../../../Common/api/routes';
import { IPlantas } from '../../../Common/interfaces/models';
import { useCoontroller } from '../controllers/useController';
import { IArea } from '../../../Common/interfaces/models';
import { useFormManager, ValidationError } from '../hooks/useFormManager';
import { RecordsScreen } from '../components/RecordsScreen';
import { FormField } from '../components/Form';
import { DrawMap } from '../components/Map/LeafletMap/Leaflet/DrawMap';
import { parsePolygon } from '../../../Common/utils/polygons';


export const Plantas: React.FC = () => {
  const controller = useCoontroller<IPlantas>(Endpoints.Plantas)
  const { ready } = controller

  const {
    ready: readyLotes,
    records: lotes,
    findById: findLoteById,
    selectOptions: lotesOptions,
  } = useCoontroller<IArea>(Endpoints.áreas)

  const columns = [
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
      text: 'Circunferencia (cm)',
      sort: true,
      filter: numberFilter(),
      formatter: (_, row) => Number(row.Circunferencia),
      type: "number",
    },
    // Agrega más columnas según sea necesario
  ];
  
  const reset = (initial?: {
    Id_Area: number;
    Codigo_Planta: string;
    Nombre: string;
    Circonferencia: number;
    lat: number;
    lng: number;
  }) => {
    const parent = findLoteById(initial?.Id_Area)
    const [Fila, Numero] = initial?.Codigo_Planta 
      ? initial.Codigo_Planta.split("F")[1].split("_T")
      : ["", ""]
    
    return ({
      ...initial,
      Fila, 
      Numero,
      Id_Area: initial?.Id_Area
        ? { label: parent?.Codigo, value: parent?.id }
        : { label: "<Seleccionar>", value: null },
      Codigo_Planta: initial?.Codigo_Planta || "",
      Nombre: initial?.Nombre || "",
      Circonferencia: initial?.Circonferencia || "",
      VisibleToStudent: initial?.VisibleToStudent,
      Punto: initial?.lat && initial?.lng
        ?{ 
          type: "point",
          points: [{ lat: initial?.lat, lng: initial?.lng }], 
          name: initial?.Codigo_Planta || "Esta área" 
        }
        :null,
    });
  };

  const crearCodigoPlanta = (Fila: string, Numero: string) => `F${Fila}_T${Numero}`
  const validarFIlaOColumna = async (v: string) => {
    if (!/^[0-9]+$/.test(v) || Number(v) > 50)
      throw new ValidationError("Debe ser un número entero")
    const codigo = crearCodigoPlanta(formManager.data.Fila, formManager.data.Numero);
    const Codigo_Planta = controller.findById(formManager.data.id)?.Codigo_Planta;
    console.log({codigo, Codigo_Planta})
    if (Codigo_Planta !== codigo &&
      (await controller.checkCodeExists("planta", codigo,
        formManager.data.Id_Area.value || formManager.data.Id_Area
      ))
    ) {
      throw new ValidationError("Ya existe un árbol con en la misma fila y columna.")
    }
  }
  const formValidator: Object = {
    Id_Area: v => {
      if (!v?.value)
        throw new ValidationError("Debe seleccionar una variedad");
    },
    Fila: (v) => validarFIlaOColumna(v),
    Numero: (v) => validarFIlaOColumna(v),
    Punto: v => {
      if ((v?.points?.length || 0) < 1) 
        throw new ValidationError("Debe definir un punto.")
    },
  };
  const formManager = useFormManager(reset, formValidator)

  const prepareSubmitForm = (data) => ({
    ...data,
    Codigo_Planta: crearCodigoPlanta(data.Fila, data.Numero),
    lat: data.Punto.points[0].lat,
    lng: data.Punto.points[0].lng,
  });

  return (
    <RecordsScreen pageTitle="Árboles de Mango" prepareSubmitForm={prepareSubmitForm}
      readiness={[readyLotes, ready]}
      columns={columns} controller={controller} formManager={formManager}
      formFields__React={<>
        <FormField
          name="Id_Area"
          label="Lote"
          type="select"
          options={lotesOptions(v => `${v.Codigo} ${v.Nombre}`)}
        />
        <FormField
          type="number"
          name="Fila"
          label="FIla de planta"
          placeholder='Ejemple: 12'
        />
        <FormField
          type="number"
          name="Numero"
          label="columna"
          placeholder='Ejemple: 23'
        />
        <FormField
          name="Nombre"
          label="Nombre"
          placeholder="Ejemplo: Espécimen 1"
        />
        <FormField
          type="number"
          name="Altitud"
          label="Altura (m. s. n. m) (GPS)"
          placeholder="Ejemplo: 24.4"
        />
        <FormField
          type="number"
          name="Circunferencia"
          label="Circunferencia (cm)"
          placeholder="Ejemplo: 101"
        />
        {formManager.data.Id_Area?.value
          // TODO Add center to map based on area polygon
          // TODO Add zoom Level
          ?<DrawMap name="Punto" type="point" label="Ubicación en el mapa"
            otherRegions={[
              ...lotes
                .filter(r => r.id === formManager.data.Id_Area?.value)
                .filter(r => r.Poligono && r.Poligono.trim() !== "")
                .map(r => ({
                  name: r.Codigo,
                  points: parsePolygon(r.Poligono),
                  color: "cyan",
                  type: "polygon",
                })),
              ...controller.records
                .filter(r => r.Codigo_Area === formManager.data.Codigo_Area)
                .filter(r => r.Codigo_Planta !== formManager.data.Codigo_Planta)
                .filter(r => r.lat && r.lng)
                .map(r => ({
                  name: r.Codigo_Planta,
                  points: [{ lat: r.lat, lng: r.lng }],
                  color: "gray",
                  type: "point",
                })),
            ]}
          />
          :null
        }
      </>}
    />
  )
}

