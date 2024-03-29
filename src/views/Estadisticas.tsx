import React, { useEffect, useMemo }  from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, BarChart, Bar, Tooltip  } from 'recharts';

import { BaseLayout } from '../components/BaseLayout';
import { Endpoints } from '../../../Common/api/routes';
import { useCoontroller } from '../controllers/useController';
import { IProduccion } from '../../../Common/interfaces/models';
import { Chart } from '../components/Chart';


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
  useEffect(() => console.log({ producciones }), [producciones])

  return (
    <BaseLayout PageName='Estadisticas'>
      <div className='container'>
        <div className="row">
          <Chart type="scatter" className="col-md-6" data={producciones} 
            title="Producciones anuales" 
          />
          <div className="col-md-6">
            <BarChart width={600} height={300} data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="uv" barSize={30} fill="#8884d8" />
              <Tooltip />
            </BarChart>
          </div>
          <div className="col-md-12">
            <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </div>
        </div>
      </div>

    </BaseLayout>
  )
}