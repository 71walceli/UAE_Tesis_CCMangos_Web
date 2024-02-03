import React, { useContext, useEffect, useState } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { CustomTable } from '../components/CustomTable';
import { Endpoints } from '../../../Common/api/routes';
import { useRequest } from '../api/UseRequest';
import { ILectura } from '../../../Common/interfaces/models';
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { GenericForm } from '../components/Form';
import Download from '../components/Download';


const columns = [
  {
    dataField: 'Victoria',
    text: 'Victoria',
  },
  {
    dataField: 'Qq',
    text: 'Quintales',
  },
  {
    dataField: 'Fecha',
    text: 'Fecha',
  },
  // Agrega más columnas según sea necesario
];
const options = [
  { value: "option1", label: "Opción 1" },
  { value: "option2", label: "Opción 2" },
  { value: "option3", label: "Opción 3" },
  { value: "option4", label: "Opción 4" },
  { value: "option5", label: "Opción 5" },
];

export const Produccion = () => {
  //const
  const { getRequest } = useRequest();
  const [data, setData] = useState<ILectura[]>([]);
  const [Lectura, setLectura] = useState({
    Nombre: "",
    Codigo: "",
    Id_Lote_id: 0,
  });
  const [show, setShow] = useState(false);
  const [showImport, setshowImport] = useState(false);
  //const {  addAlert } = useContext(AlertContext);
  //functions
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handImportleClose = () => setshowImport(false);
  const handImportleShow = () => setshowImport(true);
  const handleInputChange = (name: string, value: string) => {
    setLectura({
      ...Lectura,
      [name]: value,
    });
  };
  const ImportProduccion = () => {
    // Realiza alguna lógica de autenticación aquí
    //onLogin(formData.username, formData.password);
    alert(JSON.stringify( Lectura,null,3))
  };
  //call api
  const GetData = async () => {
    await getRequest<ILectura[]>(Endpoints.Produccion)
      .then((e) => {
        setData(e)
        console.log(e);
      })
      .catch((error) => alert(error));
  };
  useEffect(() => {
    // Realiza una solicitud a la API para obtener los datos
    GetData();
  }, []);
  return (
    <BaseLayout PageName='Produccion'>
      <div className='container'>
       {/*  <Button variant="success" onClick={handleShow}>
          <i className="bi bi-plus-circle"></i>&nbsp; Crear
        </Button> */}
        <Button variant="primary" onClick={handImportleShow}>
          <i className="bi bi-upload"></i>&nbsp;  Cargar
        </Button>
       
        <CustomTable columns={columns} data={data}></CustomTable>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Registar Lectura</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <GenericForm
              showSubmit={false}
              fields={[
                {
                  name: "Nombre",
                  label: "Nombre",
                  bclass: "form-control",
                  placeholder: "Escriba el nombre del lote",
                  value: Lectura.Nombre, // Establece el valor de username desde el estado formData
                  onChange: (value) => handleInputChange("Nombre", value), // Maneja los cambios en el username
                },
                {
                  name: "Codigo",
                  label: "Código",
                  bclass: "form-control",
                  placeholder: "Ingrese el código",
                  value: Lectura.Codigo, // Establece el valor de password desde el estado formData
                  onChange: (value) => handleInputChange("Codigo", value), // Maneja los cambios en el password
                },
                {
                  name: "Id_Lote_id",
                  label: "Lote",
                  bclass: "form-control",
                  placeholder: "Ingrese el código",
                  inputType:"select",
                  options:options,
                  value: Lectura.Id_Lote_id, // Establece el valor de password desde el estado formData
                  onChange: (value) => handleInputChange("Id_Lote_id", value), // Maneja los cambios en el password
                }
              ]}
              onSubmit={ImportProduccion}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={ImportProduccion}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showImport} onHide={handImportleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Importar Producción</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <GenericForm
              showSubmit={false}
              fields={[
               
                {
                  name: "Id_Lote_id",
                  label: "Lote",
                  bclass: "form-control",
                  placeholder: "Ingrese el código",
                  inputType:"file",
                  options:options,
                  value: Lectura.Id_Lote_id, // Establece el valor de password desde el estado formData
                  onChange: (value) => handleInputChange("Id_Lote_id", value), // Maneja los cambios en el password
                }
              ]}
              onSubmit={ImportProduccion}
            />
          </Modal.Body>
          <Modal.Footer>
          <Download fileName="FormatoProduccion.xlsx" Name='Formato de Lecturas'/>
            <Button variant="secondary" onClick={handImportleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={ImportProduccion}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

    </BaseLayout>
  )
}