import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

import { BaseLayout } from './BaseLayout';
import { CustomTable } from './CustomTable';
import { GenericForm } from './Form';
import { AuthContext } from '../context/AuthContext';
import { CircleIconButton } from './CircleIconButton';
import { useLoader } from '../hooks/useLoader';


export const RecordsScreen: React.FC = ({controller, columns, formManager, formFields, pageTitle, 
    readonly, customActions, forbidCreate, burbidUpdate, forbidDelete,
    ...props
  }) => {
  const { showLoader } = useLoader()
  useEffect(() => showLoader(), [])

  const { records, save, findById, remove } = controller
  
  const [ openModal, setOpenModal ] = useState<"form" | "delete" | null>(null);
  
  const handleClose = () => setOpenModal(null);
  
  const { UserData } = useContext(AuthContext)
  
  const [selection, setSelection] = useState<number | null>()
  
  const { data: formData, set: setFormData, reset: formReset, } = formManager

  return (
    <BaseLayout PageName={pageTitle}>
      {/* <MapContainer initialCenter={center} polygons={polygons} /> */}
      <div className="container">
        <div className="d-flex justify-content-end">
          {!forbidCreate && !readonly 
            ?<CircleIconButton icon="bi bi-plus" title="Nuevo" onPress={() => setOpenModal("form")}/>
            :null
          }
          <span style={{ width: 15 }} />
          <CircleIconButton 
            icon={readonly ? "bi bi-eye" : "bi bi-pen"}
            title={readonly ? "Ver" : "Editar"}
            color='#ffc' disabled={!selection} 
            onPress={() => {
              setFormData(formReset(findById(selection)))
              setOpenModal("form")
            }}
          />
          {!readonly 
            ?<>
              <span style={{ width: 15 }} />
              <CircleIconButton icon="bi bi-trash" title="Eliminar" color='pink' disabled={!selection} 
                onPress={() => setOpenModal("delete")}
              />
            </>
            :null
          }
          {customActions 
            ?<>
              <span style={{ width: 15 }} />
              {customActions}
            </>
            :null
          }
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
              disabled: readonly,
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
            {!readonly 
              ?<CircleIconButton 
                icon="bi bi-floppy"
                title="Guardar"
                onPress={() => {
                  (async () => {
                    const nuevoRegistro = {
                      ...formData,
                      Usuario: UserData?.usuario.user || -1,
                    };
                    Object.entries(nuevoRegistro).forEach(([key, value]) => {
                      if (nuevoRegistro[key] === undefined) {
                        delete nuevoRegistro[key]
                        return
                      }
                      nuevoRegistro[key] = value?.value ? value.value : value
                      if (nuevoRegistro[key].constructor.name === "Array") {
                        nuevoRegistro[key] = nuevoRegistro[key].map(({value}) => value)
                      }
                    })
                    console.log({nuevoRegistro})

                    await save(nuevoRegistro)
                      .then((record) => {
                        console.log({ record });
                        handleClose();
                      })
                      .catch(console.error);
                  })();
                }}
                disabled={Object.keys(formManager.errors).filter(k => k !== "undefined").length > 0}
              />
              :null
            }
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
                .then(record => {
                  console.log({ lote: record });
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
