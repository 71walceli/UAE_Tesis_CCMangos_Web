import React, { useEffect, useState } from 'react';
import MapContainer from './../components/Map'; // Asegúrate de importar el componente MapContainer desde el lugar correcto
import { BaseLayout } from '../components/BaseLayout';
import { Spinner } from 'react-bootstrap';
import { CustomTable } from '../components/CustomTable';
import { Endpoints } from '../api/routes';
import { ILote } from '../interfaces/modeld';
import { useRequest } from '../api/UseRequest';
const columns = [
  {
    dataField: 'Codigo_Lote',
    text: 'Codigo',
    //headerStyle: { backgroundColor: '#00553c',color:'#ffffff', },
  },
  {
    dataField: 'Nombre',
    text: 'Nombre',
    //headerStyle: { backgroundColor: '#00553c',color:'#ffffff', },
  },
  {
    dataField: 'Hectareas',
    text: 'Hectareas',
    //headerStyle: { backgroundColor: '#00553c',color:'#ffffff', },
  },
  {
    dataField: 'Variedad',
    text: 'Variedad',
    //headerStyle: { backgroundColor: '#00553c',color:'#ffffff', },
  }/* ,
  {
    dataField: 'acciones',
    text: 'Acciones',
    //headerStyle: { backgroundColor: '#00553c',color:'#ffffff', },
    style: { textAlign: 'center', magin: 5, },
    formatter: (cell, row) => (
      <div>
        <button className="btn btn-sm btn-primary"><i className="bi bi-pencil-square"></i></button>
        <button className="btn btn-sm btn-danger"><i className="bi bi-trash"></i></button>
      </div>
    ),
  }, */
];
export const Lotes: React.FC = () => {
  const { getRequest } = useRequest();
  const [data, setData] = useState<ILote[]>([]);
  const center = { lat: 40.7128, lng: -74.0060 }; // Coordenadas de Nueva York
  const initialZoom = 12;

  const polygons = [
    {
      paths: [
        { lat: 40.7128, lng: -74.0060 },
        { lat: 40.7128, lng: -74.0160 },
        { lat: 40.7028, lng: -74.0160 },
        { lat: 40.7028, lng: -74.0060 },
      ],
      options: {
        fillColor: 'blue',
        fillOpacity: 0.5,
        strokeColor: 'red',
        strokeWeight: 2,
      },
    },
    // Otros polígonos...
  ];
  const GetData = async () => {
    await getRequest<ILote[]>(Endpoints.lotes)
      .then((e) => {
        setData(e)
        //console.log(e);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    // Realiza una solicitud a la API para obtener los datos
    GetData();
  }, []);
  return (
    <BaseLayout PageName='Lotes'>
      <div className="row">
       {/*  <div className="col-md-12 text-center">
          <h1>Pantalla en progreso...<Spinner animation="border" variant='success' /></h1>
        </div> */}
      </div>
      {/* <MapContainer initialCenter={center} polygons={polygons} /> */}
      <div className="container">
        <div className="row">
        <CustomTable columns={columns} data={data}></CustomTable>
      </div>
      </div>
      
    </BaseLayout>
  );
};