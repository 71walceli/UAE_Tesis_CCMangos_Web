import React, { useContext, useEffect, useMemo, useState } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { CustomTable } from '../components/CustomTable';
import { Endpoints } from '../api/routes';
import { ILote } from '../interfaces/modeld';
import { useRequest } from '../api/UseRequest';
import { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';
import { GenericForm } from '../components/Form';
import { AuthContext } from '../context/AuthContext';
import { useLoader } from '../hooks/useLoader';
import { CircleIconButton } from '../components/CircleIconButton';


export const Lotes: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();
  const { getRequest, postRequest } = useRequest();
  const [data, setData] = useState<ILote[]>([]);
  
  const options = useMemo(
    () => data.map(e => e.Variedad).reduce((o, v) => Object.assign(o, {[v]: v}), {})
    , [data]
  );
  const columns = [
    {
      dataField: 'Codigo_Lote',
      text: 'Codigo',
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: 'Nombre',
      text: 'Nombre',
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: 'Hectareas',
      text: 'Hectareas',
      sort: true,
    },
    {
      dataField: 'Variedad',
      text: 'Variedad',
      sort: true,
      filter: selectFilter({
        options: options
      }),
    },
  ];
  
  const variedades = [
    "Ataulfo",
    "Kent",
    "Tommy Atkins",
  ]
  const [registro, setRecord] = useState({
    Id_Proyecto: 1,  // TODO Permitir seleccionar el proyecto
    Codigo_Lote: "",
    Nombre: "",
    Variedad: { label: "<Seleccionar>", value: "" },
  })
  
  const cargarDatos = async () => {
    await getRequest<ILote[]>(Endpoints.lotes)
      .then((lotes) => {
        setData(lotes);
      })
      .catch(console.error);
  };
  useEffect(() => {
    (async () => {
      showLoader()
      await cargarDatos();
      hideLoader()
    })()
  }, []);

  const [showForm, setShowForm] = useState(false);

  const handleClose = () => setShowForm(false);
  const handleShow = () => setShowForm(true);

  const {UserData} = useContext(AuthContext)
  const guardar = () => {
    (async () => {
      showLoader()
      const nuevoRegistro: ILote = {
        ...registro,
        Variedad: registro.Variedad.value,
        Usuario: UserData?.usuario.user || -1,
      };

      await postRequest<ILote[]>(Endpoints.lotes, nuevoRegistro)
        .then((lotes) => {
          console.log({ lotes });
          handleClose()
        })
        .catch(console.error);
      await cargarDatos()
      hideLoader()
    })();
  };

  const handleInputChange = (name: string, value: string) => {
    setRecord(v => ({
      ...v,
      [name]: value,
    }));
    console.log({ name, value })
  };

  const [selection, setSelection] = useState<number>()
  const selectionSettings = {
    mode: 'radio',
    clickToSelect: true,
    onSelect: (cell, row) => {
      setSelection(cell.id)
    },
  };
  useEffect(() => console.log({ selection }), [selection])

  return (
    <BaseLayout PageName='Lotes'>
      {/* <MapContainer initialCenter={center} polygons={polygons} /> */}
      {data.length 
        && 
        <div className="container">
          <div className="d-flex justify-content-end">
            <CircleIconButton icon="bi bi-plus" title="Nuevo" onPress={handleShow} />
            <span style={{ width: 15 }} />
            <CircleIconButton icon="bi bi-pen" title="Editar" color='#ffc' disabled={!selection} />
            <span style={{ width: 15 }} />
            <CircleIconButton icon="bi bi-trash" title="Eliminar" color='pink' disabled={!selection} />
          </div>
          <hr />
          <div className="row">
            <CustomTable columns={columns} data={data} selectRow={selectionSettings} keyField="id" />
          </div>
        </div>
      }
      <Modal show={showForm} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Registar Registro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GenericForm
            showSubmit={false}
            fields={[
              {
                name: "Codigo",
                label: "Código",
                bclass: "form-control",
                placeholder: "Ingrese el código",
                value: registro.Codigo_Lote, // Establece el valor de password desde el estado formData
                onChange: (value) => handleInputChange("Codigo_Lote", value), // Maneja los cambios en el password
              },
              {
                name: "Nombre",
                label: "Nombre",
                bclass: "form-control",
                placeholder: "Escriba el nombre del lote",
                value: registro.Nombre, // Establece el valor de username desde el estado formData
                onChange: (value) => handleInputChange("Nombre", value), // Maneja los cambios en el username
              },
              {
                name: "Variedad",
                label: "Variedad",
                bclass: "form-control",
                placeholder: "Ingrese el código",
                inputType:"select",
                options: variedades.map(v => ({
                  label: v,
                  value: v,
                })),
                value: registro.Variedad, // Establece el valor de password desde el estado formData
                onChange: (value) => handleInputChange("Variedad", value), // Maneja los cambios en el password
              },
              // TODO Agregar mapa
            ]}
            onSubmit={guardar}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-end">
            <CircleIconButton 
              color='pink'
              title="Cerrar"  
              onPress={handleClose} 
            />
            <span style={{ width: 15 }} />
            <CircleIconButton 
              icon="bi bi-floppy"
              title="Guardar" 
              onPress={guardar} 
            />
          </div>
        </Modal.Footer>
      </Modal>
      
    </BaseLayout>
  );
};