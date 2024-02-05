import React, { useEffect, useState, ChangeEvent } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { CustomTable } from '../components/CustomTable';
import { Endpoints } from '../../../Common/api/routes';
import { useRequest } from '../api/UseRequest';
import { IRol } from '../../../Common/interfaces/models';
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { GenericForm } from '../components/Form';
import { useRolState } from '../states/PlantaState';
import Download from '../components/Download';


const columns = [
  {
    dataField: 'name',
    text: 'Rol',
  },
  {
    dataField: 'first_name',
    text: 'Permisos',
  }
];

export const Roles = () => {
  //const
  const { getRequest, postFileRequest } = useRequest();
  const { Rol, handleInputChange } = useRolState();
  const [data, setData] = useState<IRol[]>([]);
  const [show, setShow] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [file, setFile] = useState<File | null>(null)
  //functions
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseCreate = () => setShowCreate(false);
  const handleShowCreate = () => setShowCreate(true);

  const SavePlanta = () => {
    const formData = new FormData()
    formData.append('usuarios', file as any)

    postFileRequest(Endpoints.ImportUsers, formData)
      .then((e) => {
        console.log(e, formData);
      })
      .catch((error) => alert(error.response.data));
    console.log(JSON.stringify(formData, null, 3))
  };
  //call api
  const GetData = async () => {
    await getRequest<IRol[]>(Endpoints.Roles)
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

  const SetearFile = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('archivo xd', e[0])
    const archivo = e[0]
    console.log('archivo xd', archivo)
    if (archivo) {
      setFile(archivo)
    }
  }

  return (
    <BaseLayout PageName='Usuarios'>
      <div className='container'>
        <div className="row">
          <div className="col-sm-2">
            <Button variant="success">
              <i className="bi bi-plus-circle" onClick={handleShowCreate}></i>&nbsp;
            </Button>
            <Button variant="primary" onClick={handleShow}>
              <i className="bi bi-upload"></i>&nbsp;
            </Button>
          </div>
          <div className="col-sm-2">
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-sm-12">
            <CustomTable columns={columns} data={data}></CustomTable>

          </div>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Cargar usuarios</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <GenericForm
              showSubmit={false}
              fields={[
                {
                  name: "usuarios",
                  label: "Archivo",
                  bclass: "form-control",
                  inputType: "file",
                  value: Rol?.name, // Establece el valor de password desde el estado formData
                  onChange: (value) => {
                    //handleInputChange("usuarios", value)
                    SetearFile(value)
                    console.log(value)
                  }, // Maneja los cambios en el password
                }
              ]}
              onSubmit={() => { }}
            />
          </Modal.Body>
          <Modal.Footer>
          <Download fileName="FormatoUsuarios.xlsx" Name='Formato de Lecturas'/>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={SavePlanta}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showCreate} onHide={handleCloseCreate}>
          <Modal.Header closeButton>
            <Modal.Title>Crear rol</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <GenericForm
              showSubmit={false}
              fields={[
                {
                  name: "name",
                  label: "Nombre",
                  bclass: "form-control",
                  value: Rol?.name, // Establece el valor de password desde el estado formData
                  
                  onChange: (value) => handleInputChange("name", value),
                }
              ]}
              onSubmit={() => { }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseCreate}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={SavePlanta}>
            <i className="bi bi-rocket-takeoff"></i> Enviar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

    </BaseLayout>
  )
}