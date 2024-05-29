import { useEffect, useState } from "react"


const source = "useFormManager"
export const useFormManager = (reset: Object | ((Object?) => {}), validator?: Object) => {
  const [data, set] = useState(typeof reset === "function" ? reset() : reset)
  useEffect(() => console.log({ source: "useFormManager", formData: data }), [data])
  
  const [errors, setErrors] = useState({})
  validator = validator || {}
  useEffect(() => {
    const newErrors = Object.fromEntries(
      Object.entries(validator).map(([field, criteria]) => {
        const value = data[field]
        try {
          criteria(value)
          return []
        } catch (error) {
          // TODO Catch specific value error exception
          error = error.message
          return [field, error]
        }
      })
    )
    setErrors(newErrors)
    console.log({ source, errors: newErrors })
  }, [data])

  return { data, set, reset, errors, 
    handleChange: (prop, value) => set(prevData => ({
      ...prevData,
      [prop]: value,
    }))
  }
}
