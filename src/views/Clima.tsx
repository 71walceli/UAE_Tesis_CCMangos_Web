import React, {  } from "react"
import { dateFilter, numberFilter, textFilter } from "react-bootstrap-table2-filter"
import { format } from "date-fns";

import { Endpoints } from "../../../Common/api/routes";
import { useCoontroller } from "../controllers/useController";
import { RecordsScreen } from "../components/RecordsScreen";
import { useFormManager } from "../hooks/useFormManager";
import { IUser } from "../../../Common/interfaces/models";
import { CircleIconButton } from "../components/CircleIconButton";
import { useApiController } from "../../../Common/api/useApi";
import useToaster from "../hooks/useToaster";
import { useAuth } from "../context/AuthContext";


export const Sincronizaciones = () => {
  const controller = useCoontroller(Endpoints.WeatherData)
  
  const numberFormatter = (number: string | number) => number ? Number(number) : null
  const dateFormatter = (date: Date) => date ? format(date, "yyyy-MM-dd HH:mm") : null
  const reset = (initial: {
    id: number,
    Date: Date,
    Date_Sync: Date,
    Date_Arable_Sync: Date,

    Device: string,
    Activo: boolean,
    Usuario: IUser,

    Temp_Air_Min: number,
    Temp_Air_Mean: number,
    Temp_Air_Max: number,
    Dew_Temp_Min: number,
    Dew_Temp_Mean: number,
    Dew_Temp_Max: number,
    Relat_Hum_Min: number,
    Relat_Hum_Mean: number,
    Relat_Hum_Max: number,
    Atmospheric_Pressure_Min: number,
    Atmospheric_Pressure_Max: number,
    Precipitation: number,
    Wind_Speed_Min: number,
    Wind_Speed_Mean: number,
    Wind_Speed_Max: number,
  }) => ({
    ...initial,
    id: numberFormatter(initial?.id),

    Date: dateFormatter(initial?.Date),
    Date_Sync: dateFormatter(initial?.Date_Sync),
    Date_Arable_Sync: dateFormatter(initial?.Date_Arable_Sync),

    Device: initial?.Device || "",
    Activo: initial?.Activo || true,
    Usuario: initial?.Usuario?.username || "",
    
    Temp_Air_Min: numberFormatter(initial?.Temp_Air_Min),
    Temp_Air_Mean: numberFormatter(initial?.Temp_Air_Mean),
    Temp_Air_Max: numberFormatter(initial?.Temp_Air_Max),
    Dew_Temp_Min: numberFormatter(initial?.Dew_Temp_Min),
    Dew_Temp_Mean: numberFormatter(initial?.Dew_Temp_Mean),
    Dew_Temp_Max: numberFormatter(initial?.Dew_Temp_Max),
    Relat_Hum_Min: numberFormatter(initial?.Relat_Hum_Min),
    Relat_Hum_Mean: numberFormatter(initial?.Relat_Hum_Mean),
    Relat_Hum_Max: numberFormatter(initial?.Relat_Hum_Max),
    Atmospheric_Pressure_Min: numberFormatter(initial?.Atmospheric_Pressure_Min),
    Atmospheric_Pressure_Max: numberFormatter(initial?.Atmospheric_Pressure_Max),
    Precipitation: numberFormatter(initial?.Precipitation),
    Wind_Speed_Min: numberFormatter(initial?.Wind_Speed_Min),
    Wind_Speed_Mean: numberFormatter(initial?.Wind_Speed_Mean),
    Wind_Speed_Max: numberFormatter(initial?.Wind_Speed_Max),
  })
  const formManager = useFormManager(reset)

  const {records} = controller
  
  const dateFormatterForRow = (date: Date) => date ? format(date, "yyyy-MM-dd\n HH:mm") : null
  const colunms = [
    {
      dataField: "id",
      text: "ID",
      sort: true,
      filter: textFilter(),
      formatter: numberFormatter,
    },
    {
      dataField: "Date",
      text: "Fecha",
      sort: true,
      filter: dateFilter(),
      formatter: dateFormatterForRow,
    },
    {
      dataField: "Temp_Air_Mean",
      text: "°C",
      sort: true,
      filter: numberFilter(),
      formatter: numberFormatter,
    },
    {
      dataField: "Dew_Temp_Mean",
      text: "P. Rocío",
      sort: true,
      filter: numberFilter(),
      formatter: numberFormatter,
    },
    {
      dataField: "Relat_Hum_Mean",
      text: "Humedad Rel.",
      sort: true,
      filter: numberFilter(),
      formatter: numberFormatter,
    },
    {
      dataField: "Atmospheric_Pressure_Max",
      text: "Presión Atmos.",
      sort: true,
      filter: numberFilter(),
      formatter: numberFormatter,
    },
    {
      dataField: "Precipitation",
      text: "Lluvias",
      sort: true,
      filter: numberFilter(),
      formatter: numberFormatter,
    },
    {
      dataField: "Wind_Speed_Mean",
      text: "Vel. Viento",
      sort: true,
      filter: numberFilter(),
      formatter: numberFormatter,
    },
  ];
  const formFields = [
    {
      name: "id",
      label: "ID",
      bclass: "form-control",
    },
    {
      name: "Date",
      label: "Fecha",
      bclass: "form-control",
    },
    {
      name: "Temp_Air_Min",
      label: "Temperatura Mínima",
      bclass: "form-control",
    },
    {
      name: "Temp_Air_Mean",
      label: "Temperatura media",
      bclass: "form-control",
    },
    {
      name: "Temp_Air_Max",
      label: "Temperatura máxima",
      bclass: "form-control",
    },
    {
      name: "Dew_Temp_Min",
      label: "Punto de Rocío Mínima",
      bclass: "form-control",
    },
    {
      name: "Dew_Temp_Mean",
      label: "Punto de Rocío media",
      bclass: "form-control",
    },
    {
      name: "Dew_Temp_Max",
      label: "Punto de Rocío máxima",
      bclass: "form-control",
    },
    {
      name: "Relat_Hum_Min",
      label: "Húmedad Relativa Mínima",
      bclass: "form-control",
    },
    {
      name: "Relat_Hum_Mean",
      label: "Húmedad Relativa media",
      bclass: "form-control",
    },
    {
      name: "Relat_Hum_Max",
      label: "Húmedad Relativa máxima",
      bclass: "form-control",
    },
    {
      name: "Atmospheric_Pressure_Min",
      label: "°Presión Atmosférica Mínima",
      bclass: "form-control",
    },
    {
      name: "Atmospheric_Pressure_Max",
      label: "°Presión Atmosférica Máxima",
      bclass: "form-control",
    },
    {
      name: "Precipitation",
      label: "Precipitaciones acumuladas",
      bclass: "form-control",
    },
    {
      name: "Wind_Speed_Min",
      label: "Velocidad de viento Mínima",
      bclass: "form-control",
    },
    {
      name: "Wind_Speed_Mean",
      label: "Velocidad de viento media",
      bclass: "form-control",
    },
    {
      name: "Wind_Speed_Max",
      label: "Velocidad de viento máxima",
      bclass: "form-control",
    },
  ];

  const {get} = useApiController(useAuth())
  const {notify} = useToaster()

  return (
    <RecordsScreen 
      readonly
      customActions={
        <CircleIconButton 
          title="Sincronizar"
          icon="bi bi-arrow-clockwise"
          onPress={() => {
            get(Endpoints.WeatherSync)
              .then(() => notify("Sincronización correcta", "success"))
              .catch(error => {
                notify("Ocurrió un problema al intentar sincronizar", "error")
                console.error(error)
              })
          }}
        />
      }
      controller={controller}
      columns={colunms}
      data={records}
      formFields={formFields}
      formManager={formManager}
      pageTitle="Datos climáticos"
    />
  )
}