import React, {  } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Spinner } from 'react-bootstrap';


export const Estimaciones = () => {
  return (
    <BaseLayout PageName='Estimaciones'>
      <div className='container d-flex align-items-center justify-content-center'>
        <div className="row">
          <div className="col-md-12 text-center">
            <h1>Pantalla en espera...<Spinner animation="border" variant='success' /></h1>
          </div>
        </div>
      </div>

    </BaseLayout>
  )
}