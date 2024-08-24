import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Placeholder } from 'rsuite';

import { BaseLayout } from './BaseLayout';
import { CustomTable } from './CustomTable';
import { GenericForm, GenericFormReact } from './Form';
import { AuthContext } from '../context/AuthContext';
import { CircleIconButton } from './CircleIconButton';
import { useLoader } from '../hooks/useLoader';
import { Spacer } from './Spacer';


export const RecordsScreen: React.FC = ({controller, columns, formManager, formFields, 
  formFields__React, pageTitle, readonly, customActions, forbidCreate, burbidUpdate, forbidDelete, 
  prepareSubmitForm, readiness,
  ...props
}) => {
  if (!readiness) readiness = []
  const { showLoader, isLoading } = useLoader()
  useEffect(() => showLoader(), [])

  const { records, save, findById, remove } = controller
  
  const [ openModal, setOpenModal ] = useState<"form" | "delete" | null>(null);
  
  const handleClose = () => setOpenModal(null);
  
  const { UserData } = useContext(AuthContext)
  
  const [selection, setSelection] = useState<number | null>()
  
  const { data: formData, set: setFormData, reset: formReset, } = formManager

  return (
    <BaseLayout PageName={pageTitle}>
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
          {!isLoading && readiness.every(Boolean)
            ?<CustomTable columns={columns} data={records} 
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
            :<Placeholder.Grid rows={10} columns={columns.length} active />
          }
        </div>
      </div>
      <Modal show={openModal === "form"} onHide={handleClose} animation 
        onExit={() => setSelection(null)}
        onExited={() => setFormData(formReset())}
      >
        <Modal.Header>
          Formulario de {pageTitle} - {formData.id ? "Editar" : "Nuevo"}
        </Modal.Header>
        <Modal.Body>
          {formFields 
            ?<GenericForm className='d-flex' manager={formManager} showSubmit={false}
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
            :null
          }
          {formFields__React
            ?<GenericFormReact className='d-flex' showSubmit={false} manager={formManager}>
              {formFields__React?.props.children}
            </GenericFormReact>
            :null
          }
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
                    let nuevoRegistro = {
                      ...formData,
                      Usuario: UserData?.usuario.user || -1,
                    };
                    Object.entries(nuevoRegistro).forEach(([key, value]) => {
                      if (nuevoRegistro[key] === undefined) {
                        delete nuevoRegistro[key]
                        return
                      }
                      nuevoRegistro[key] = value?.value ? value.value : value
                      if (nuevoRegistro[key]?.constructor.name === "Array") {
                        nuevoRegistro[key] = nuevoRegistro[key].map(({value, ...rest}) => value || rest)
                      }
                    })
                    if (prepareSubmitForm) {
                      nuevoRegistro = prepareSubmitForm(nuevoRegistro)
                    }
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
            <Spacer />
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
