import React  from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Spinner } from 'react-bootstrap';

import { LineChart, Line, CartesianGrid, XAxis, YAxis, BarChart, Bar,Tooltip  } from 'recharts';
const data = [{ name: 'Ene', uv: 0 }, { name: 'Feb', uv: 501}, { name: 'Page B', uv: 681}];

export const Estadisticas = () => {
  return (
    <BaseLayout PageName='Estadisticas'>
      <div className='container'>
        <div className="row">
          <div className="col-md-12 text-center">
            <h1>Pantalla en espera...<Spinner animation="border" variant='success' /></h1>
          </div>
          <div className="col-md-6">
          <LineChart width={600} height={300} data={data}>
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </div>
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