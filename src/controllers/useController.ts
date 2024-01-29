import { useEffect, useMemo, useState } from "react"
import { useRequest } from "../api/UseRequest";
import { useLoader } from "../hooks/useLoader";
import { arrayIndexer } from "../../../Common/helpers/utils";
import { useApi, useApiController } from "../../../Common/api/useApi";
import { useAuth } from "../context/AuthContext";
import useToaster from "../hooks/useToaster";


export const useCoontroller = <T>(apiEndpoint: string) => {
  const { showLoader, hideLoader } = useLoader()
  const authContext = useAuth()
  const { get, patch, post, remove } = useApiController(authContext)
  const [ records, setRecords ] = useState<T[]>([])
  useEffect(() => console.log({ records }), [records])

  const index = useMemo(() => arrayIndexer(records), [records])
  useEffect(() => console.log({ index }), [index])

  const { notify } = useToaster()

  const readAll = () => get<T[]>(apiEndpoint)
    .then((records) => {
      setRecords(records);
    })
    .catch(e => { 
      notify(
        `Ha ocurrido un error del sistema`, 
        "error"
      )
      throw e 
    })
    .finally(() => {
      hideLoader()
    })
  useEffect(() => {
    (async () => {
      showLoader()
      await readAll();
      hideLoader()
    })()
  }, []);

  const save = (record: T) => (async () => {
    showLoader();
    const newRecord: T = record.id ? {
      ...findById(record.id),
      ...record,
    } : {
      ...record,
    };

    const method = record.id ? patch : post

    await method<T>(apiEndpoint, newRecord)
      .then((lote) => {
        notify(
          `${record.id ? "Actualizado" : "Creado"} correctamente el registro ${lote.id}`, 
          "success"
        )
        return lote
      })
      .catch(e => { 
        notify(
            `Ha ocurrido un error del sistema`, 
            "error"
          )
        throw e 
      })
      .finally(async () => {
        await readAll();
        hideLoader();
      })
  })();

  const findById = (id) => records[index[id]]

  return { records, loadAll: readAll, save, findById, 
    remove: (record: T) => (async () => {
      console.log({ record })
      showLoader();
      await remove<T>(apiEndpoint, { id: record.id })
        .then((lote) => {
          notify(
            `Eliminado correctamente el registro ${record.id}`, 
            "success"
          )
        })
        .catch(e => { 
          notify(
            `Ha ocurrido un error del sistema`, 
            "error"
          )
          throw e 
        })
        .finally(async () => {
          await readAll();
          hideLoader();
        })
    })()
  }
}
