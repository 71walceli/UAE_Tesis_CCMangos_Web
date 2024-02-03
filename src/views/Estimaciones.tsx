import React, { useEffect, useState, ChangeEvent } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { CustomTable } from '../components/CustomTable';
import { Endpoints } from '../../../Common/api/routes';
import { useRequest } from '../api/UseRequest';
import { IPlantas } from '../interfaces/AuthInterface';
import { Modal, Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { GenericForm } from '../components/Form';
import { usePlantaState } from '../states/PlantaState';


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