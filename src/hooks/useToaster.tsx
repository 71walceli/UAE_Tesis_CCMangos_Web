import { Notification, useToaster as useRsuiteToaster } from "rsuite"
import React from "react"


const useToaster = (...props) => {
  const toaster = useRsuiteToaster(props)
  return {...toaster, 
    /* push: (message) => 
      toaster.push(<Notification>{ message }</Notification>) */
    notify: (message, type, options) => {
      const pushOptions = { duration: 13000, placement: "bottomEnd", ...options?.pushOptions || {} }
      const notificationProps = { closable: true, ...options?.notificationProps || {} }
      notificationProps.header = notificationProps.header
        || type === "success" && "Operación exitosa"
        || type === "warning" && "Advertencia"
        || type === "error" && "Error"
        || type === "info" && "Notificación"
      console.log({message, pushOptions, notificationProps})
      return toaster.push(
        <Notification type={type} {...notificationProps}>{message}</Notification>,
        pushOptions
      )
    }
  }
}
export default useToaster