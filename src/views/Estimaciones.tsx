import React, { useContext, useEffect, useState } from 'react';

import { Chart } from '../components/Chart';
import { BaseLayout } from '../components/BaseLayout';
import { useApiController } from '../../../Common/api/useApi';
import { useAuth } from '../context/AuthContext';
import useToaster from '../hooks/useToaster';
import { Endpoints } from '../../../Common/api/routes';
import { LoaderContext } from '../context/LoaderContext';
import { CircleIconButton } from '../components/CircleIconButton';
import { Modal } from 'react-bootstrap';


export const Estimaciones = () => {
  const { get } = useApiController(useAuth());
  const { notify } = useToaster()

  const [ cosechas, setCosechas] = useState();
  const [ datosClimáticos, setDatosClimáticos] = useState();

  useEffect(() => {
    (async () => {
      try {
        setCosechas( await (get(Endpoints.PrediccionesCosecha).then(({results}) => results)) )
        setDatosClimáticos( await (get(Endpoints.PrediccionesClima).then(({results}) => results)) )
      } catch (error) {
        console.error(error)
        notify("Problema al cargar las estimaciones", "error");
      }
    })();
  }, {cosechas, datosClimáticos})

  const translations = {
    Precipitation: "Precipitaciones",
    Temp_Air: "Temperatura",
    Temp_Air_Mean: "Temperatura",
    Temp_Air_Min: "Temperatura Min.",
    Temp_Air_Max: "Temperatura Máx.",
    Dew_Temp: "Punto de Rocío",
    Dew_Temp_Mean: "Punto de Rocío",
    Dew_Temp_Max: "Punto de Rocío Min.",
    Dew_Temp_Min: "Punto de Rocío Máx.",
    Relat_Hum: "Humedad Relativa",
    Relat_Hum_Mean: "Humedad Relativa",
    Relat_Hum_Min: "Humedad Relativa Min.",
    Relat_Hum_Max: "Humedad Relativa Máx.",
    Wind_Speed: "Velocidad del viento",
    Wind_Speed_Mean: "Velocidad del viento",
    Wind_Speed_Min: "Velocidad del viento Min.",
    Wind_Speed_Max: "Velocidad del viento Máx.",
    Atmospheric_Pressure: "Presión Atmosférica",
    Atmospheric_Pressure_Max: "Presión Atmosférica Min.",
    Atmospheric_Pressure_Min: "Presión Atmosférica Máx.",
  }

  const { showLoader, hideLoader } = useContext(LoaderContext)

  const [ openModal, setOpenModel ] = useState(false)
  const handleClose = () => setOpenModel(false)

  return (
    <BaseLayout PageName='Estimaciones de Producción'>
      {cosechas 
        ?<div className='container'>
        <h2 className='text-center'>Predicciones de Producción de Mango</h2>
        <div className="row">
          {Object.entries(cosechas).map(([variedad, _variedad]) => <div key={variedad} 
            className="col-md-6"
          >
            <Chart type="line"
              title={variedad } 
              series={['min', 'value', 'max']}
              data={
                _variedad.min.map((minValue, index) => ({
                  x: 2023 + index,
                  min: minValue,
                  value: _variedad.value[index],
                  max: _variedad.max[index]
                }))
              }
            />
          </div>)}
        </div>
      </div>
      :null
    }
    {datosClimáticos
      ?<div className='container'>
        <h2 className='text-center'>Predicciones de variables edafoclimáticas</h2>
        <div className="row">
          {Object.entries(datosClimáticos).map(([variable, _variable]) => <div key={variable} 
            className="col-md-6"
          >
            <Chart type="line" 
              series={['min', 'value', 'max']}
              title={
                translations[variable]
              }
              data={(() => {
                const data = _variable;
                // Merge keys from min, value, and max, then deduplicate
                const allDates = [...new Set([
                  ...Object.keys(data.min), 
                  ...Object.keys(data.value), 
                  ...Object.keys(data.max)])
                ];

                const formattedData = allDates.map(date => ({
                  x: date.substring(0, 7),
                  min: data.min[date] || null, // Use null or a suitable default value if the date is missing
                  value: data.value[date] || null,
                  max: data.max[date] || null
                }));
                return formattedData;
              })()}
            />
          </div>)}
        </div>
      </div>
      :null
    }
      

    </BaseLayout>
  )
}
