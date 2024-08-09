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
      <div className='container'>
        <div className="d-flex justify-content-end" style={{
          gap: 15,
        }}>
          <CircleIconButton title="Actualizar" icon="bi bi-arrow-clockwise" 
            onClick={() => {
              // TODO Add real logic
              showLoader()
              setTimeout(() => {
                hideLoader()
              }, 750 + Math.random()*2000)
            }} 
          />
          <CircleIconButton title="Explícame" icon="bi bi-question" 
            onClick={() => { setOpenModel("explicame") }} 
          />
        </div>
      </div>

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
      
      <Modal show={openModal === "explicame"} onHide={handleClose} animation 
        onExit={() => {}}
        onExited={() => {}}
      >
        <Modal.Header>
          ¿Cómo funciona?
        </Modal.Header>
        <Modal.Body>
          <p>
            En esta pantalla, se muestran gráficas representativas a las estimaciones de producción
            de mango.
          </p>

          <p>
            En primerlugar, se muestran las predicciones estimada de nango, de las cuales se incican
            valores estimados en gráficos
          </p>
                    
          <h4>Colores</h4>
          <p>
            Para las variables edafoclimáticas, se utiliza los siguentes colores
          </p>
          <ul>
            <li>
              <span style={{color: 'red'}}>Rojo</span>: Valor máximo para variable
            </li>
            <li>
              <span style={{color: 'green'}}>Verde</span>: Valor medio para variable
            </li>
            <li>
              <span style={{color: 'blue'}}>Azul</span>: Valor mínimo para variable
            </li>
          </ul>
            
          <h4>Explicación del procesamiento de los datos</h4>
          <ol>
            <li>
              <b>
                SARIMA para variables edafoclimáticas
              </b>
              : Se aplica modelos SARIMA (Seasonal AutoRegressive Integrated Moving Average) a las series de tiempo de las variables edafoclimáticas para identificar patrones estacionales y de tendencia. 
              Se Utilizó estos modelos para generar predicciones de las condiciones climáticas y del suelo en los próximos años.
            </li>
            <br />
            <p>
              Los datos fueron tratados, eliminando valores nulos, siendo resumidos de la siguiente manera:
            </p>
            <h5>Series de tiempo edafoclimátivos mensuales</h5>
            <table className='table table-striped table-bordered'>
              <tr>
                <th className='text-center'>Mes</th>
                <th className='text-center'>Temp. Media (°C)</th>
                <th className='text-center'>...</th>
                <th className='text-center'>Hum. Rel. (%)</th>
              </tr>
              <tr>
                <td className="">2017-01</td>
                <td className="text-end">24.6</td>
                <td className="text-center">...</td>
                <td className="text-end">54</td>
              </tr>
              <tr>
                <td className="">2017-02</td>
                <td className="text-end">37</td>
                <td className="text-center">...</td>
                <td className="text-end">76</td>
              </tr>
              <tr>
                <td className="">2017-03</td>
                <td className="text-end">22.1</td>
                <td className="text-center">...</td>
                <td className="text-end">65</td>
              </tr>
              <tr>
                <td className="text-center">...</td>
                <td className="text-center">...</td>
                <td className="text-center">...</td>
                <td className="text-center">...</td>
              </tr>
              <tr>
                <td className="">2023-09</td>
                <td className="text-end">31.1</td>
                <td className="text-center">...</td>
                <td className="text-end">65</td>
              </tr>
              <tr>
                <td className="">2023-10</td>
                <td className="text-end">28.4</td>
                <td className="text-center">...</td>
                <td className="text-end">71</td>
              </tr>
              <tr>
                <td className="">2023-11</td>
                <td className="text-end">26.4</td>
                <td className="text-center">...</td>
                <td className="text-end">78</td>
              </tr>
            </table>

            <li>
              <b>
                SARIMA para variables edafoclimáticas
              </b>
              : Aplicar modelos SARIMA (Seasonal AutoRegressive Integrated Moving Average) a las series de tiempo de las variables edafoclimáticas para identificar patrones estacionales y de tendencia. Utilizar estos modelos para generar predicciones de las condiciones climáticas y del suelo en los próximos años.
            </li>
            
            <h5>Series de tiempo edafoclimátivos predichas</h5>
            <table className='table table-striped table-bordered'>
              <tr>
                <th className='text-center'>Mes</th>
                <th className='text-center'>Temp. Media (°C)</th>
                <th className='text-center'>...</th>
                <th className='text-center'>Hum. Rel. (%)</th>
              </tr>
              <tr>
                <td className="">2023-12</td>
                <td className="text-end">23.4</td>
                <td className="text-center">...</td>
                <td className="text-end">46</td>
              </tr>
              <tr>
                <td className="">2024-01</td>
                <td className="text-end">33.2</td>
                <td className="text-center">...</td>
                <td className="text-end">63</td>
              </tr>
              <tr>
                <td className="">2024-02</td>
                <td className="text-end">22.1</td>
                <td className="text-center">...</td>
                <td className="text-end">67</td>
              </tr>
              <tr>
                <td className="text-center">...</td>
                <td className="text-center">...</td>
                <td className="text-center">...</td>
                <td className="text-center">...</td>
              </tr>
            </table>

            <li>
              <b>
                Bosque aleatorio para producción
              </b>
              : Construir un modelo de bosque aleatorio utilizando como variables predictoras las predicciones de SARIMA de las variables edafoclimáticas y otras características relevantes (edad de los árboles, prácticas agrícolas, etc.). Entrenar el modelo con los datos históricos de producción de mango para establecer las relaciones entre las variables predictoras y la producción.
            </li>
            
            <h5>Predicción de producción de mango</h5>
            <table className='table table-striped table-bordered'>
              <tr>
                <th className='text-center'>Año</th>
                <th className='text-center'>Tommy Atkins (Kg)</th>
                <th className='text-center'>Ataulfo (Kg)</th>
              </tr>
              <tr>
                <td className="">2024</td>
                <td className="text-end">9492.19</td>
                <td className="text-end">1715,43</td>
              </tr>
              <tr>
                <td className="">2025</td>
                <td className="text-end">9593.01</td>
                <td className="text-end">1803.72</td>
              </tr>
              <tr>
                <td className="">2026</td>
                <td className="text-end">9744.15</td>
                <td className="text-end">2021.7</td>
              </tr>
              <tr>
                <td className="text-center">...</td>
                <td className="text-center">...</td>
                <td className="text-center">...</td>
              </tr>
            </table>

          </ol>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-end">
            <CircleIconButton 
              color='pink'
              title="Cerrar" 
              onPress={handleClose} 
            />
          </div>
        </Modal.Footer>
      </Modal>
    </BaseLayout>
  )
}
