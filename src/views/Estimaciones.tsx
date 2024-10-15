import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { endOfYear, startOfYear } from 'date-fns';

import { Chart } from '../components/Chart';
import { BaseLayout } from '../components/BaseLayout';
import { useApiController } from '../../../Common/api/useApi';
import { useAuth } from '../context/AuthContext';
import useToaster from '../hooks/useToaster';
import { Endpoints } from '../../../Common/api/routes';
import { LoaderContext } from '../context/LoaderContext';
import { CircleIconButton } from '../components/CircleIconButton';
import { useCoontroller } from '../controllers/useController';
import { formatNumber } from '../../../Common/helpers/formats';
import { abbreviations, strings } from '../../../Common/misc/resources';
import { InputNumber } from 'rsuite';


export const Estimaciones = () => {
  const { get } = useApiController(useAuth());
  const { notify } = useToaster()

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [ monthBounds, setMonthBounds ] = useState([startOfYear(currentDate), endOfYear(currentDate)])
  useEffect(() => { console.log({monthBounds}) }, [monthBounds])
  
  const [ yearFilter, setYearFilter ] = useState([currentYear, currentYear])
  useEffect(() => setYearFilter(
    [monthBounds[0].getFullYear(), monthBounds[1].getFullYear()]//.join(",")
  ), [monthBounds])
  useEffect(() => { console.log({yearFilter}) }, [yearFilter])

  const {
    records: _datosClima,
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
      "Atmospheric_Pressure_Min",
      "Atmospheric_Pressure_Max",
    ]
    return Object.entries(
      _datosClima.reduce((all, item) => {
        const month = item.Date.substring(0, 7)
        if (!all[month]) {
          all[month] = []
        }
        all[month].push(item)
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

  const { 
    records: _cosechas,
  } = useCoontroller<IProduccion>(Endpoints.Produccion);
  const cosechas = useMemo(() => _.chain(_cosechas)
    .sortBy((a1) => a1.Fecha)
    .groupBy(p => `${p.Variedad.Nombre} ${p.Fecha.substring(0, 4)}`)
    .keyBy(p => p[0].Variedad.Nombre)
    .mapValues(p => ({
      lotes: p.length,
      anio: Number(p[0].Fecha.substring(0, 4)),
    }))
    .value(), [_cosechas]
  )
  useEffect(() => console.log({cosechas}), [cosechas])

  const handleGetCosechas = async () => setCosechasPredichas(await (get(Endpoints.PrediccionesCosecha)
    .then(({ results }) => Object.fromEntries(
      Object.entries(results)
        .map(([variedad, r]) => [variedad, ({
          ...r,
          min: r.min.map(v => Number(v) * cosechas[variedad].lotes),
          value: r.value.map(v => Number(v) * cosechas[variedad].lotes),
          max: r.max.map(v => Number(v) * cosechas[variedad].lotes),
        })])
    ))
    .catch(e => {
      if (e instanceof TypeError && e.message === "Cannot read properties of undefined (reading 'lotes'") {
        // FIX, sino error aparece como si fuera de recuperar datos.
      }
    })
  ))
  const [ cosechasPredichas, setCosechasPredichas] = useState();
  useEffect(() => {
    (async () => {
      if (!cosechas)
        return
      try {
        if (!cosechasPredichas) {
          showLoader()
          await handleGetCosechas();
        }
      } catch (error) {
        console.error(error)
        notify("Problema al cargar las estimaciones", "error");
      } finally {
        hideLoader()
      }
    })();
  }, [cosechasPredichas, cosechas])
  useEffect(() => console.log({cosechasPredichas}), [cosechasPredichas])

  const [ _datosClimaPredichos, setDatosClimaPredichos] = useState();
  useEffect(() => {
    (async () => {
      try {
        if (!_datosClimaPredichos) {
          showLoader()
          setDatosClimaPredichos( await (get(Endpoints.PrediccionesClima).then(({results}) => results)) )
        }
      } catch (error) {
        console.error(error)
        notify("Problema al cargar las estimaciones", "error");
      } finally {
        hideLoader()
      }
    })();
  }, [_datosClimaPredichos])
  const datosClimaAnuales = useMemo(() => {
    if (!_datosClimaPredichos) {
      return []
    }

    let output = _datosClimaPredichos
    output = Object.entries(
      Object.entries(output).map(([variable, seriesTiempo]) => [
        ...Object.entries(seriesTiempo.min).map(([date, value]) => ({
          variable,
          date,
          value,
          rank: "min"
        })),
        ...Object.entries(seriesTiempo.value).map(([date, value]) => ({
          variable,
          date,
          value,
          rank: "value"
        })),
        ...Object.entries(seriesTiempo.max).map(([date, value]) => ({
          variable,
          date,
          value,
          rank: "max"
        })),
      ])
        .flatMap(x => x)
        .reduce((acc, item) => {
          const { date, rank, value, variable } = item
          if (!acc[rank]) {
            acc[rank] = {}
          }
          const year = date.substring(0, 4)
          if (!acc[rank][year]) {
            acc[rank][year] = {}
          }
          acc[rank][year][`${variable}_count`] = (acc[rank][year][`${variable}_count`] || 0) + 1
          acc[rank][year][variable] = (acc[rank][year][variable] || 0) + value

          setMonthBounds(([start, end]) => {
            const month = new Date(date.substring(0, 7))
            return [
              month < start ? month : start,
              month > end ? month : end
            ]
          })
          return acc
        }, {})
    )
    output = Object.fromEntries(output
      .map(([rank, timeSeries]) => [rank, Object.fromEntries(Object.entries(timeSeries)
        .map(([year, vars]) => [year, Object.fromEntries(Object.entries(vars)
          .filter(([key]) => !key.endsWith('_count'))
          .map(([variable, value]) => [variable, value / vars[`${variable}_count`]])
        )])
      )])
      .map(([rank, timeSeries]) => [rank, Object.entries(timeSeries)
        .map(([year, vars]) => ({ date: year, ...vars }))
      ])
    )
    return output
  }, [_datosClimaPredichos])

  const [metricas, setMetricas] = useState<undefined>();
  useState(() => {
    (async () => {
      try {
        if (!metricas) {
          showLoader()
          setMetricas( await (get(Endpoints.PrediccionesMetricas).then(({results}) => results)) )
        }
      } catch (error) {
        console.error(error)
        notify("Problema al cargar las métricas", "error");
      } finally {
        hideLoader()
      }
    })();
  }, [metricas])
  useEffect(() => { console.log({metricas}) }, [metricas])
  
  const [ openModal, setOpenModel ] = useState<string | null>(null)
  const handleClose = () => setOpenModel(null)

  return (
    <BaseLayout PageName='Estimaciones de Producción'>
      <div className='container'>
        <div className="d-flex justify-content-end" style={{
          gap: 15,
        }}>
          <div className="d-flex flex-column align-items-center">
            <InputNumber value={yearFilter[0]} formatter={v => `Desde ${v}`}
              onChange={_year => setYearFilter(_yearFilter => {
                _yearFilter = _yearFilter.map(Number)
                _year = Number(_year)
                if (_year +2 > _yearFilter[1] || _year < monthBounds[0].getFullYear()) {
                  _yearFilter = [..._yearFilter,];
                } else {
                  _yearFilter = [_year, _yearFilter[1]];
                }
                return _yearFilter
              })} 
            />
            <InputNumber value={yearFilter[1]} formatter={v => `hasta ${v}`}
              onChange={_year => setYearFilter(_yearFilter => {
                _yearFilter = _yearFilter.map(Number)
                _year = Number(_year)
                if (_yearFilter[0] +2 > _year || _year > monthBounds[1].getFullYear()) {
                  _yearFilter = [..._yearFilter,];
                } else {
                  _yearFilter = [_yearFilter[0], _year];
                }
                return _yearFilter
              })} 
            />
          </div>
          <CircleIconButton title="Actualizar" icon="bi bi-arrow-clockwise" 
            onClick={() => {
              showLoader()
              get(Endpoints.PrediccionesActualizar)
                .then(handleGetCosechas)
                .catch(e => notify("Error al actualizar predicciones", "error"))
                .finally(hideLoader)
            }} 
          />
          <CircleIconButton title="Explícame" icon="bi bi-question" 
            onClick={() => { setOpenModel("explicame") }} 
          />
        </div>
      </div>

      {cosechasPredichas 
        ?<div className='container'>
        <h2 className='text-center'>Predicciones de Producción de Mango</h2>
        <div className="row">
          {Object.entries(cosechasPredichas).map(([variedad, _variedad]) => <div key={variedad} 
            className="col-md-6"
          >
            <Chart type="line"
              title={variedad } 
              series={['min', 'value', 'max']}
              data={
                _variedad.min.map((minValue, index) => ({
                  x: monthBounds[0].getFullYear() + index,
                  min: minValue,
                  value: _variedad.value[index],
                  max: _variedad.max[index],
                }))
                  .filter(({x}) => x >= yearFilter[0] && x <= yearFilter[1])
              }
            />
            <table className='table table-bordered table-striped'>
              <tr>
                <th>Año</th>
                {/* <th>Valor</th> */}
                <th className='text-center'>Producción (kg)</th>
                {metricas?.variables_seleccionadas?.[variedad].map((variable, _index) => (
                  <th key={_index} className="text-center">{abbreviations[variable]}</th>
                ))}
              </tr>
              {Array.from({length: 6}, (_, index) => index)
                .filter(x => x+monthBounds[0].getFullYear() >= yearFilter[0] 
                  && x+monthBounds[0].getFullYear() <= yearFilter[1]
                )
                .map((index) => (
                  "value".split(" ").map(rank => (
                    <tr key={`${index} ${rank}`}>
                      <td>{monthBounds[0].getFullYear() + index}</td>
                      {/* <td>{abbreviations[rank]}</td> */}
                      <td className="text-end">{formatNumber(_variedad[rank][index])}</td>
                      {metricas?.variables_seleccionadas?.[variedad].map((variable, _index) => (
                        <td key={_index} className="text-end">
                          {formatNumber(datosClimaAnuales[rank]?.[index][variable])}
                        </td>
                      ))}
                    </tr>
                  ))
                ))
              }
            </table>
          </div>)}
        </div>
      </div>
      :null
    }
    {_datosClimaPredichos
      ?<div className='container'>
        <h2 className='text-center'>Predicciones de variables edafoclimáticas</h2>
        <div className="row">
          {Object.entries(_datosClimaPredichos).map(([variable, _variable]) => <div key={variable} 
            className="col-md-6"
          >
            <Chart type="line" 
              series={['min', 'value', 'max']}
              title={strings[variable]}
              data={(() => {
                const data = _variable;
                const allDates = [...new Set([
                  ...Object.keys(data.min), 
                  ...Object.keys(data.value), 
                  ...Object.keys(data.max)])
                ];

                return allDates.map(date => ({
                  x: date.substring(0, 7),
                  min: data.min[date] || 0,
                  value: data.value[date] || 0,
                  max: data.max[date] || 0,
                }));
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
                <th className='text-center'>{strings["Relat_Hum_Mean"]}</th>
                <th className='text-center'>{strings["Wind_Speed_Mean"]}</th>
              </tr>
              {datosClimaMensuales.slice(0,3).map((item, index) => (
                <tr key={index}>
                  <td className="">{item.x}</td>
                  <td className="text-end">{formatNumber(item.Relat_Hum_Mean)}</td>
                  <td className="text-end">{formatNumber(item.Wind_Speed_Mean)}</td>
                </tr>
              ))}
              <tr>
                <td className="text-center">...</td>
                <td className="text-center">...</td>
                <td className="text-center">...</td>
              </tr>
              {datosClimaMensuales.slice(datosClimaMensuales.length -3).map((item, index) => (
                <tr key={index}>
                  <td className="">{item.x}</td>
                  <td className="text-end">{formatNumber(item.Temp_Air_Mean)}</td>
                  <td className="text-end">{formatNumber(item.Relat_Hum_Mean)}</td>
                </tr>
              ))}
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
                <th className='text-center'>{strings["Relat_Hum_Mean"]}</th>
                <th className='text-center'>{strings["Wind_Speed_Mean"]}</th>
              </tr>
              {datosClimaAnuales?.value?.slice(1,4).map((item, index) => (
                <tr key={index}>
                  <td className="">{item.date}</td>
                  <td className="text-end">{formatNumber(item.Relat_Hum_Mean)}</td>
                  <td className="text-end">{formatNumber(item.Wind_Speed_Mean)}</td>
                </tr>
              ))}
              <tr>
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
                <th className='text-center'>Variedad</th>
                {Array.from({length: 3}, (_, i) => i + 2023).map((year, index) => (
                  <th key={index} className='text-end'>{year}</th>
                ))}
                <th className="text-center">...</th>
              </tr>
              {metricas?.variables_seleccionadas && Object.entries(metricas?.variables_seleccionadas).map(([variedad, predicciones], index) => (
                <tr key={index}>
                  <td className="">{variedad}</td>
                  {cosechasPredichas?.[variedad].value.slice(1,4).map((item, index) => (
                    <td className="text-end">{formatNumber(item)}</td> 
                  ))}
                  <td className="text-center">...</td>
                </tr>
              ))}
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
