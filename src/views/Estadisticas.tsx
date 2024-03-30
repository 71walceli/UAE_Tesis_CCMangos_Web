import React, { useEffect, useMemo }  from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, BarChart, Bar, Tooltip  } from 'recharts';

import { BaseLayout } from '../components/BaseLayout';
import { Endpoints } from '../../../Common/api/routes';
import { useCoontroller } from '../controllers/useController';
import { IProduccion } from '../../../Common/interfaces/models';
import { Chart } from '../components/Chart';
import { numberFormatter } from '../../../Common/helpers/formats';


const data = [{ name: 'Ene', uv: 0 }, { name: 'Feb', uv: 501}, { name: 'Page B', uv: 681}];

export const Estadisticas = () => {
  const { records: _producciones } = useCoontroller<IProduccion>(Endpoints.Produccion);
  const producciones = useMemo(() => {
    return _producciones
      .sort((a1, a2) => a1.Fecha > a2.Fecha ? 1 : -1)
      .map(p => ({
        x: new Date(p.Fecha), 
        y: Number(p.Cantidad), 
        series: Number(p.Cantidad) > 5000 ? "Tommy" : "Ataulfo"
      }))
  }, [_producciones])
  
  const { records: _datosClima } = useCoontroller(Endpoints.WeatherData);
  const datosClima = useMemo(() => {
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
      "Atmospheric_Pressure_Min",
      "Atmospheric_Pressure_Max",
    ]
    const props = [
      "Date",
      ...environmentalProps
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

  return (
    <BaseLayout PageName='Estadisticas'>
      <div className='container'>
        <div className="row">
          <Chart type="scatter" className="col-md-6" data={producciones} 
            title="Producciones anuales" 
          />
          <Chart type="line" className="col-md-6" data={datosClima} 
            series={["Temp_Air_Min", "Temp_Air_Mean", "Temp_Air_Max"]}
            title="Temperaturas" 
          />
          <Chart type="line" className="col-md-6" data={datosClima} 
            series={["Dew_Temp_Min", "Dew_Temp_Mean", "Dew_Temp_Max"]}
            title="Punto de Rocío" 
          />
          <Chart type="line" className="col-md-6" data={datosClima} 
            series={["Relat_Hum_Min", "Relat_Hum_Mean", "Relat_Hum_Max"]}
            title="Humedad relativa" 
          />
          <Chart type="line" className="col-md-6" data={datosClima} 
            series={["Wind_Speed_Min", "Wind_Speed_Mean", "Wind_Speed_Max"]}
            title="Velocidad del viento" 
          />
          <Chart type="line" className="col-md-6" data={datosClima} 
            series={["Precipitation"]}
            title="Precipitaciones" 
          />
          <Chart type="line" className="col-md-6" data={datosClima} 
            series={["Atmospheric_Pressure_Min", "Atmospheric_Pressure_Max"]}
            title="Presión Atmosférica" 
          />
        </div>
      </div>

    </BaseLayout>
  )
}