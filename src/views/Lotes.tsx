import React, { useContext, useEffect, useState } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { CustomTable } from '../components/CustomTable';
import { Endpoints } from '../api/routes';
import { ILote } from '../../../Common/interfaces/models';
import { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import { Modal } from 'react-bootstrap';
import { GenericForm } from '../components/Form';
import { AuthContext } from '../context/AuthContext';
import { CircleIconButton } from '../components/CircleIconButton';
import { useCoontroller } from '../controllers/useController';


export const Lotes: React.FC = () => {
  const { records, save, findById, remove } = useCoontroller<ILote>(Endpoints.lotes)
  
  const variedades = [
    "Ataulfo",
    "Kent",
    "Tommy Atkins",
  ]
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
        options: variedades.reduce((o, v) => Object.assign(o, {[v]: v}), {})
      }),
    },
  ];
  
  const resetForm = (initial?: {
    Id_Proyecto: number; 
    Codigo_Lote: string; 
    Nombre: string; 
    Variedad: string; 
  }) => ({
    ...initial,
    Id_Proyecto: initial?.Id_Proyecto ||  1,  // TODO Permitir seleccionar el proyecto
    Codigo_Lote: initial?.Codigo_Lote || "",
    Nombre: initial?.Nombre || "",
    Variedad: initial?.Variedad 
      ? { label: initial?.Variedad, value: initial?.Variedad} : { label: "<Seleccionar>", value: "" },
  })
  const [formData, setFormData] = useState(resetForm())
  useEffect(() => console.log({ formData }))

  const [ openModal, setOpenModal ] = useState<"form" | "delete" | null>(null);

  //const handleShow = () => setShowForm(true);
  const handleClose = () => setOpenModal(null);

  const { UserData } = useContext(AuthContext)

  const handleInputChange = (name: string, value: string) => {
    setFormData(v => ({
      ...v,
      [name]: value,
    }));
    console.log({ name, value })
  };

  const [selection, setSelection] = useState<number | null>()
  useEffect(() => console.log({ selection }), [selection])

  return (
    <BaseLayout PageName='Lotes'>
      {/* <MapContainer initialCenter={center} polygons={polygons} /> */}
      {records.length 
        && <div className="container">
          <div className="d-flex justify-content-end">
            <CircleIconButton icon="bi bi-plus" title="Nuevo" onPress={() => setOpenModal("form")}/>
            <span style={{ width: 15 }} />
            <CircleIconButton icon="bi bi-pen" title="Editar" color='#ffc' disabled={!selection} 
              onPress={() => {
                setFormData(resetForm(findById(selection)))
                setOpenModal("form")
              }}
            />
            <span style={{ width: 15 }} />
            <CircleIconButton icon="bi bi-trash" title="Eliminar" color='pink' disabled={!selection} 
              onPress={() => setOpenModal("delete")}
            />
          </div>
          <hr />
          <div className="row">
            <CustomTable columns={columns} data={records} 
              selectRow={{
                mode: 'radio',
                clickToSelect: true,
                selected: selection ? [selection] : [],
                onSelect: (cell, row) => {
                  console.log({ cell, row })
                  setSelection(cell.id)
                },
              }} 
              keyField="id" 
              defaultSorted={[
                {
                  dataField: 'Codigo_Lote',
                  order: 'asc'
                },
                {
                  dataField: 'Nombre',
                  order: 'asc'
                },
              ]}
            />
          </div>
        </div>
      }
      <Modal show={openModal === "form"} onHide={handleClose} animation 
        onExit={() => {
          setSelection(null)
        }}
        onExited={() => {
          setFormData(resetForm())
        }}
      >
        <Modal.Body>
          <GenericForm
            showSubmit={false}
            fields={[
              {
                name: "Codigo",
                label: "Código",
                bclass: "form-control",
                placeholder: "Ingrese el código",
                value: formData.Codigo_Lote, // Establece el valor de password desde el estado formData
                onChange: (value) => handleInputChange("Codigo_Lote", value), // Maneja los cambios en el password
              },
              {
                name: "Nombre",
                label: "Nombre",
                bclass: "form-control",
                placeholder: "Escriba el nombre del lote",
                value: formData.Nombre, // Establece el valor de username desde el estado formData
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
                value: formData.Variedad, // Establece el valor de password desde el estado formData
                onChange: (value) => handleInputChange("Variedad", value), // Maneja los cambios en el password
              },
              // TODO Agregar mapa
            ]}
            onSubmit={() => {
              (async () => {
                const nuevoRegistro: ILote = {
                  ...formData,
                  Variedad: formData.Variedad.value,
                  Usuario: UserData?.usuario.user || -1,
                };

                await save(nuevoRegistro)
                  .then((lotes) => {
                    console.log({ lotes });
                    handleClose();
                  })
                  .catch(console.error);
              })();
            }}
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
              onPress={() => {
                (async () => {
                  const nuevoRegistro: ILote = {
                    ...formData,
                    Variedad: formData.Variedad.value,
                    Usuario: UserData?.usuario.user || -1,
                  };

                  await save(nuevoRegistro)
                    .then((lotes) => {
                      console.log({ lotes });
                      handleClose();
                    })
                    .catch(console.error);
                })();
              }} 
            />
          </div>
        </Modal.Footer>
      </Modal>
      <Modal show={openModal === "delete"} onHide={handleClose} animation 
        onExit={() => {
          setSelection(null)
        }}
        onExited={() => {
          setFormData(resetForm())
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>¿Está seguro de eliminar {findById(selection)?.Codigo_Lote}?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <div className="d-flex justify-content-end">
            <CircleIconButton 
              title="No"  
              icon="bi bi-check"
              onPress={handleClose} 
              />
            <span style={{ width: 15 }} />
            <CircleIconButton 
              color='pink'
              icon="bi bi-x"
              title="Sí" 
              onPress={() => {
                remove(findById(selection))
                  .then(lote => {
                    console.log({ lote })
                    handleClose()
                  })
                  .catch(console.error)
              }} 
            />
          </div>
        </Modal.Footer>
      </Modal>
      
    </BaseLayout>
  );
};
