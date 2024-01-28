import { useEffect, useState } from "react"
import { useRequest } from "../api/UseRequest";
import { useLoader } from "../hooks/useLoader";

export const useCoontroller = <T>(apiEndpoint: string) => {
  const { showLoader, hideLoader } = useLoader()
  const { getRequest, postRequest } = useRequest()
  const [records, setRecords] = useState<T[]>()

  const loadAll = () => getRequest<T[]>(apiEndpoint)
    .then((records) => {
      setRecords(records);
    })
    .catch(console.error);
  useEffect(() => {
    (async () => {
      showLoader()
      await loadAll();
      hideLoader()
    })()
  }, []);

  const save = (record: T) => (async () => {
    showLoader();
    const newRecord: T = {
      ...record,
    };

    await postRequest<T[]>(apiEndpoint, newRecord)
      .then((lotes) => {
        console.log({ lotes });
      })
      .catch(console.error);
    await loadAll();
    hideLoader();
  })();

  return { records, loadAll, save }
}
