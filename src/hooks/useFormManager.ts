import { useEffect, useState } from "react"


const source = "useFormManager"
export function ValidationError (message) {
  this.message = message;
  this.name = "ValidationError"
}
ValidationError.prototype = new Error();

export const useFormManager = (reset: Object | ((Object?) => {}), validator?: Object) => {
  const [data, set] = useState(typeof reset === "function" ? reset() : reset)
  useEffect(() => console.log({ source: "useFormManager", formData: data }), [data])
  
  const [errors, setErrors] = useState({})
  validator = validator || {}
  useEffect(() => {
    const newErrors = Promise.all(
      Object.entries(validator).map(async ([field, criteria]) => {
        const value = data[field]
        try {
          await criteria(value, data)
          return []
        } catch (error) {
          if (error instanceof ValidationError) {
            error = error.message
            return [field, error]
          }
          throw error
        }
      })
    ).then(newErrors => {
      newErrors = Object.fromEntries(newErrors)
      setErrors(newErrors)
      console.log({ source, errors: newErrors })
    })
  }, [data])

  return { data, set, reset, errors, 
    handleChange: (prop, value) => set(prevData => ({
      ...prevData,
      [prop]: value,
    })),
    isValid: () => Object.keys(errors).filter(k => k !== "undefined").length > 0,
  }
}
