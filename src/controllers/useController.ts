import { useEffect, useMemo, useState } from "react"
import { useLoader } from "../hooks/useLoader";
import { arrayIndexer } from "../../../Common/helpers/utils";
import { useApiController } from "../../../Common/api/useApi";
import { useAuth } from "../context/AuthContext";
import useToaster from "../hooks/useToaster";


interface IndexedT {
  id: number;
}
interface IController {
  records: any[],
  loadAll: () => void,
}
export const useCoontroller = <T extends IndexedT>(apiEndpoint: string) => {
  console.log({source: "useController", apiEndpoint})
  const { showLoader, hideLoader } = useLoader()
  const { get, patch, post, remove } = useApiController(useAuth())
  
  const [ records, setRecords ] = useState<T[]>([])
  useEffect(() => console.log({ source:"useController", records }), [records])
  
  const [ index, setIndex ] = useState<{[key: number]: number}>({})
  useEffect(() => console.log({ index: index }), [index])

  const [ ready, setReady ] = useState(false)
  const { notify } = useToaster()

  const readAll = () => {
    setReady(false);
    return get<T[]>(apiEndpoint)
      .then((records) => {
        setRecords(records);
        setIndex(arrayIndexer(records));
      })
      .catch(e => {
        notify(
          `Ha ocurrido un error del sistema`,
          "error"
        );
        throw e;
      })
      .finally(() => {
        hideLoader();
        setReady(true);
      });
  }
  useEffect(() => {
    (async () => {
      await readAll();
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

  const findById = <I>(id: number) => records[index[id]]

  // TODO 10000 Refactor to use common Code
  const checkCodeExists = (entity: string, code: string, parent_id) => get("/misc/verificar_existencia", {
    entidad: entity, 
    codigo: code,
    parent_id,
  }).then(({result, objects}) => result)

  const selectOptions = (getLabel) => records
    .map(v => ({
      label: getLabel(v),
      value: v.id,
    }))
  
  const filterOptions = ({getLabel, getKey}) => Object.assign(records
    .sort((a1, a2) => getKey(a1) > getKey(a2) ? 1 : -1)
    .reduce((all, current) => {
      all[current.id] = getLabel(current)
      return all
    }, {}))
  
  return { records, loadAll: readAll, save, findById, checkCodeExists, selectOptions, filterOptions, 
    ready,
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
