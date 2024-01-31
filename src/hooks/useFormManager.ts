import { useEffect, useState } from "react"

export const useFormManager = (reset: Object | ((Object?) => {})) => {
  const [data, set] = useState(typeof reset === "function" ? reset() : reset)
  useEffect(() => console.log({ formData: data }))

  // TODO Add validation

  return { data, set, reset }
}
