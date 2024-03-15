import React, {   } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import "./style.css"


export const CustomTable = ({ columns, data, ...props }) => {
  return (
    <div>
      <BootstrapTable
        sizePerPage={25}
        pagination={paginationFactory({
          sizePerPageList: [
            { text: '10', value: 10 },
            { text: '25', value: 25 },
            { text: '50', value: 50 },
            { text: '100', value: 100 },
          ],
          showTotal: true,
          paginationTotalRenderer: (from, to, size) => (
            <span className="react-bootstrap-table-pagination-total">
              Del { from } al { to }, en total { size } registros
            </span>
          )
        })}
        striped
        hover
        condensed
        noDataIndication={() => 'No hay datos disponibles'} // Mostrar mensaje cuando no hay datos
        exportCSV={true} // Agregar botones para exportar
        csvFileName="datos.csv" // Nombre del archivo CSV
        keyField="id" // Asegúrate de ajustar esto al campo de clave única de tus datos
        data={data}
        filter={ filterFactory() }
        filterPosition="top"
        columns={columns}
        {...props}
      />
      
    </div>
  );
};