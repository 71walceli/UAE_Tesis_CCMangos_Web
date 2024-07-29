import Notification from "rsuite/Notification"
import { useToaster as useRsuiteToaster } from "rsuite"
import React from "react"


const useToaster = () => {
  const toaster = useRsuiteToaster()
  return {...toaster, 
    notify: (message, type, options?) => {
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
