import React, { useContext, useEffect, useMemo, useState }  from 'react';
import _ from 'lodash';

import { BaseLayout } from '../components/BaseLayout';
import { Endpoints } from '../../../Common/api/routes';
import { useCoontroller } from '../controllers/useController';
import { IProduccion } from '../../../Common/interfaces/models';
import { Chart } from '../components/Chart';
import { CircleIconButton } from '../components/CircleIconButton';
import { LoaderContext } from '../context/LoaderContext';
import { Modal } from 'react-bootstrap';


export const Estadisticas = () => {
  const { 
    records: _cosechas,
    loadAll: reloadProducciones,
  } = useCoontroller<IProduccion>(Endpoints.Produccion);
  const cosechas = useMemo(() => {
    return _.chain(_cosechas)
      .sortBy((a1) => a1.Fecha)
      .groupBy(p => `${p.Variedad.Nombre} ${p.Fecha.substring(0,4)}`)
      .map(p => ({
        x: Number(p[0].Fecha.substring(0,4)), 
        y: _.chain(p)
          .sumBy(_p => Number(_p.Cantidad))
          .value(), 
        series: p[0].Variedad.Nombre,
        variedad: p[0].Variedad.Nombre,
      }))
      .flatMap(p => p)
      .value()
  }, [_cosechas])
  useEffect(() => console.log({cosechas}), [cosechas])
  
  const { 
    records: _datosClima, 
    loadAll: reloadDatosClima,
  } = useCoontroller(Endpoints.WeatherData);
  const datosClimaMensuales = useMemo(() => {
    const environmentalProps = [
      "Temp_Air_Min",
      "Temp_Air_Mean",
      "Temp_Air_Max",
      "Dew_Temp_Min",
      "Dew_Temp_Mean",
      "Dew_Temp_Max",
      "Relat_Hum_Min",
      "Relat_Hum_Mean",
      "Relat_Hum_Max",
      "Wind_Speed_Min",
      "Wind_Speed_Mean",
      "Wind_Speed_Max",
      "Precipitation",
      "AtmosphericPressure_Min",
      "AtmosphericPressure_Max",
    ]
    return Object.entries(
      _datosClima.reduce((all, item) => {
        const category = item.Date.substring(0, 7)
        if (!all[category]) {
          all[category] = []
        }
        all[category].push(item)
        return all
      }, {})
    )
      .map(([key, item]) => ({
        Date: key,
        ...item.reduce(
          (aggregated, item) => {
            environmentalProps.forEach(key => aggregated[key].push(item[key] ? Number(item[key]) : null))
            return aggregated
          },
          Object.fromEntries(environmentalProps.map(key => [key, []]))
        )
      }))
      .map(item =>
        Object.fromEntries([
          ["x", item.Date],
          ...environmentalProps
            .map(prop => [prop, item[prop].filter(v => v)])
            .filter(([_, value]) => value.length > 0)
            .map(([prop, value]) => {
              if (!item[prop]) {
                return [undefined, undefined]
              }
              return [
                prop,
                value.reduce((total, current) => total + current, 0) / value.length
              ]
            })
        ])
      )
  }, [_datosClima])

  const { showLoader, hideLoader } = useContext(LoaderContext)

  const [ openModal, setOpenModel ] = useState(null)
  const handleClose = () => setOpenModel(false)

  return (
    <BaseLayout PageName='Estadísticas'>
      <div className='container'>
        <div className="d-flex justify-content-end" style={{
          gap: 15,
        }}>
          <CircleIconButton title="Actualizar" icon="bi bi-arrow-clockwise" 
            onClick={() => {
              showLoader()
              reloadProducciones()
                .finally(() => hideLoader())
              
              showLoader()
              reloadDatosClima()
                .finally(() => hideLoader())
            }} 
          />
          <CircleIconButton title="Explícame" icon="bi bi-question" 
            onClick={() => { setOpenModel("explicame") }} 
          />
        </div>
      </div>
      <div className='container'>
        <div className="row justify-content-center">
          {cosechas.length && _.chain(cosechas)
            .groupBy(c => c.variedad)
            .map(c => 
              <Chart type="line" className="col-md-6" data={c} 
                title={c[0].variedad} 
              />
            )
            .value()
          }
        </div>
      </div>
      <div className='container'>
        <div className="row">
          <Chart type="line" className="col-md-6" data={datosClimaMensuales} 
            series={["Temp_Air_Min", "Temp_Air_Mean", "Temp_Air_Max"]}
            title="Temperaturas" 
          />
          <Chart type="line" className="col-md-6" data={datosClimaMensuales} 
            series={["Dew_Temp_Min", "Dew_Temp_Mean", "Dew_Temp_Max"]}
            title="Punto de Rocío" 
          />
          <Chart type="line" className="col-md-6" data={datosClimaMensuales} 
            series={["Relat_Hum_Min", "Relat_Hum_Mean", "Relat_Hum_Max"]}
            title="Humedad relativa" 
          />
          <Chart type="line" className="col-md-6" data={datosClimaMensuales} 
            series={["Wind_Speed_Min", "Wind_Speed_Mean", "Wind_Speed_Max"]}
            title="Velocidad del viento" 
          />
          <Chart type="line" className="col-md-6" data={datosClimaMensuales} 
            series={["Precipitation"]}
            title="Precipitaciones" 
          />
          <Chart type="line" className="col-md-6" data={datosClimaMensuales} 
            series={["AtmosphericPressure_Min", "AtmosphericPressure_Max"]}
            title="Presión Atmosférica" 
          />
        </div>
      </div>

      <Modal show={openModal === "explicame"} onHide={handleClose} animation 
        onExit={() => {}}
        onExited={() => {}}
      >
        <Modal.Header>
          ¿Cómo funciona?
        </Modal.Header>
        <Modal.Body>
          <p>
            En esta pantalla, se muestran las estadísticas de las producciones de mango y los datos 
            edafoclimáticos de la finca.
          </p>

          <p>
            Los datos de producción se muestran en un gráfico de dispersión, donde se muestra la
            cantidad de mango producido en kilos en cada fecha, dando la sumatoria anual.
          </p>

          <p>
            Se distingue entre dos variedades de mango:
          </p>
          
          <ul>
            <li>Tommy Atkins</li>
            <li>Ataulfo</li>
          </ul>
          
          <h4>Colores</h4>
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