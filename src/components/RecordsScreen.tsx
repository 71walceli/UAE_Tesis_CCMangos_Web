import React, { useContext, useEffect, useState } from 'react';
import { BaseLayout } from './BaseLayout';
import { CustomTable } from './CustomTable';
import { ILote } from '../interfaces/modeld';
import { Modal } from 'react-bootstrap';
import { GenericForm } from './Form';
import { AuthContext } from '../context/AuthContext';
import { CircleIconButton } from './CircleIconButton';


export const RecordsScreen: React.FC = ({controller, columns, formManager, formFields, ...props}) => {
  const { records, save, findById, remove } = controller

  
  const [ openModal, setOpenModal ] = useState<"form" | "delete" | null>(null);
  
  const handleClose = () => setOpenModal(null);
  
  const { UserData } = useContext(AuthContext)
  
  const [selection, setSelection] = useState<number | null>()
  
  const { data: formData, set: setFormData, reset: formReset, } = formManager

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
                setFormData(formReset(findById(selection)))
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
          setFormData(formReset())
        }}
      >
        <Modal.Body>
          <GenericForm
            manager={formManager}
            showSubmit={false}
            fields={formFields.map(field => ({
              ...field,
              value: formManager.data[field.name],
              onChange: (value) => formManager.set(previous => ({
                ...previous,
                [field.name]: value,
              })),
            }))}
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
          setFormData(formReset())
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
              onPress={() => remove(findById(selection))
                .then(lote => {
                  console.log({ lote });
                  handleClose();
                })
                .catch(console.error)} 
            />
          </div>
        </Modal.Footer>
      </Modal>
      
    </BaseLayout>
  );
};
