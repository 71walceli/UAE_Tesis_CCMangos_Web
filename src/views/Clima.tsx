import React, { useContext, useState } from "react"
import { dateFilter, numberFilter, textFilter } from "react-bootstrap-table2-filter"
import { Modal } from "react-bootstrap";
import { endOfDay, isAfter, isEqual } from "date-fns";

import { Endpoints } from "../../../Common/api/routes";
import { useCoontroller } from "../controllers/useController";
import { RecordsScreen } from "../components/RecordsScreen";
import { ValidationError, useFormManager } from "../hooks/useFormManager";
import { IUser } from "../../../Common/interfaces/models";
import { CircleIconButton } from "../components/CircleIconButton";
import { useApiController } from "../../../Common/api/useApi";
import useToaster from "../hooks/useToaster";
import { AuthContext, useAuth } from "../context/AuthContext";
import { dateFormatter, formatNumber } from "../../../Common/helpers/formats";
import { iconos } from "../theme/appTheme";
import { Spacer } from "../components/Spacer";
import { FormField, GenericFormReact } from "../components/Form";
import { LoaderContext } from "../context/LoaderContext";


export const Sincronizaciones = () => {
  const controller = useCoontroller(Endpoints.WeatherData)
  
  const formManager = useFormManager(((initial: {
      id: number;
      Date: Date;
      Date_Sync: Date;
      Date_Arable_Sync: Date;

      Device: string;
      Activo: boolean;
      Usuario: IUser;

      Temp_Air_Min: number;
      Temp_Air_Mean: number;
      Temp_Air_Max: number;
      Dew_Temp_Min: number;
      Dew_Temp_Mean: number;
      Dew_Temp_Max: number;
      Relat_Hum_Min: number;
      Relat_Hum_Mean: number;
      Relat_Hum_Max: number;
      Atmospheric_Pressure_Min: number;
      Atmospheric_Pressure_Max: number;
      Precipitation: number;
      Wind_Speed_Min: number;
      Wind_Speed_Mean: number;
      Wind_Speed_Max: number;
    }) => ({
      ...initial,
      id: formatNumber(initial?.id),

      Date: dateFormatter(initial?.Date),
      Date_Sync: dateFormatter(initial?.Date_Sync),
      Date_Arable_Sync: dateFormatter(initial?.Date_Arable_Sync),

      Device: initial?.Device || "",
      Activo: initial?.Activo || true,
      Usuario: initial?.Usuario?.username || "",

      Temp_Air_Min: formatNumber(initial?.Temp_Air_Min),
      Temp_Air_Mean: formatNumber(initial?.Temp_Air_Mean),
      Temp_Air_Max: formatNumber(initial?.Temp_Air_Max),
      Dew_Temp_Min: formatNumber(initial?.Dew_Temp_Min),
      Dew_Temp_Mean: formatNumber(initial?.Dew_Temp_Mean),
      Dew_Temp_Max: formatNumber(initial?.Dew_Temp_Max),
      Relat_Hum_Min: formatNumber(initial?.Relat_Hum_Min),
      Relat_Hum_Mean: formatNumber(initial?.Relat_Hum_Mean),
      Relat_Hum_Max: formatNumber(initial?.Relat_Hum_Max),
      Atmospheric_Pressure_Min: formatNumber(initial?.Atmospheric_Pressure_Min),
      Atmospheric_Pressure_Max: formatNumber(initial?.Atmospheric_Pressure_Max),
      Precipitation: formatNumber(initial?.Precipitation),
      Wind_Speed_Min: formatNumber(initial?.Wind_Speed_Min),
      Wind_Speed_Mean: formatNumber(initial?.Wind_Speed_Mean),
      Wind_Speed_Max: formatNumber(initial?.Wind_Speed_Max),
    })))

  const {records} = controller
  
  const colunms = [
    {
      dataField: "id",
      text: "Código",
      sort: true,
      filter: textFilter(),
      formatter: formatNumber,
    },
    {
      dataField: "Date",
      text: "Fecha",
      sort: true,
      filter: dateFilter(),
      formatter: dateFormatter,
    },
    {
      dataField: "Temp_Air_Mean",
      text: "Temp. (°C)",
      sort: true,
      filter: numberFilter(),
      formatter: formatNumber,
    },
    {
      dataField: "Dew_Temp_Mean",
      text: "P. Rocío (°C)",
      sort: true,
      filter: numberFilter(),
      formatter: formatNumber,
    },
    {
      dataField: "Relat_Hum_Mean",
      text: "Hum. Rel. (%)",
      sort: true,
      filter: numberFilter(),
      formatter: formatNumber,
    },
    {
      dataField: "Atmospheric_Pressure_Max",
      text: "Pres. Atmos. (hPa)",
      sort: true,
      filter: numberFilter(),
      formatter: formatNumber,
    },
    {
      dataField: "Precipitation",
      text: "Lluvias (mm)",
      sort: true,
      filter: numberFilter(),
      formatter: formatNumber,
    },
    {
      dataField: "Wind_Speed_Mean",
      text: "Vel. Viento (km/h)",
      sort: true,
      filter: numberFilter(),
      formatter: formatNumber,
    },
  ];
  const formFields = [
    {
      name: "id",
      label: "Código",
      bclass: "form-control",
    },
    {
      name: "Date",
      label: "Fecha",
      bclass: "form-control",
    },
    {
      name: "Temp_Air_Min",
      label: "Temperatura Mínima (°C)",
      bclass: "form-control",
    },
    {
      name: "Temp_Air_Mean",
      label: "Temperatura media (°C)",
      bclass: "form-control",
    },
    {
      name: "Temp_Air_Max",
      label: "Temperatura máxima (°C)",
      bclass: "form-control",
    },
    {
      name: "Dew_Temp_Min",
      label: "Punto de Rocío Mínima (°C)",
      bclass: "form-control",
    },
    {
      name: "Dew_Temp_Mean",
      label: "Punto de Rocío media (°C)",
      bclass: "form-control",
    },
    {
      name: "Dew_Temp_Max",
      label: "Punto de Rocío máxima (°C)",
      bclass: "form-control",
    },
    {
      name: "Relat_Hum_Min",
      label: "Húmedad Relativa Mínima (%)",
      bclass: "form-control",
    },
    {
      name: "Relat_Hum_Mean",
      label: "Húmedad Relativa media (%)",
      bclass: "form-control",
    },
    {
      name: "Relat_Hum_Max",
      label: "Húmedad Relativa máxima (%)",
      bclass: "form-control",
    },
    {
      name: "Atmospheric_Pressure_Min",
      label: "°Presión Atmosférica Mínima (hPa)",
      bclass: "form-control",
    },
    {
      name: "Atmospheric_Pressure_Max",
      label: "°Presión Atmosférica Máxima (hPa)",
      bclass: "form-control",
    },
    {
      name: "Precipitation",
      label: "Precipitaciones acumuladas (mm)",
      bclass: "form-control",
    },
    {
      name: "Wind_Speed_Min",
      label: "Velocidad de viento Mínima(km/h)",
      bclass: "form-control",
    },
    {
      name: "Wind_Speed_Mean",
      label: "Velocidad de viento media (km/h)",
      bclass: "form-control",
    },
    {
      name: "Wind_Speed_Max",
      label: "Velocidad de viento máxima(km/h)",
      bclass: "form-control",
    },
  ];

  const [ openModal, setOpenModal ] = useState(null)
  const handleClose = () => setOpenModal(null)

  const { loadAll } = controller

  return <>
    <RecordsScreen 
      readonly
      customActions={<>
        <CircleIconButton 
          title="Importar"
          icon="bi bi-upload"
          onPress={() => {
            setOpenModal("import")
          }}
        />
        <Spacer />
        <CircleIconButton 
          title="Eliminar"
          icon={iconos.basura}
          color="pink"
          onPress={() => {
            setOpenModal("delete")
          }}
        />
      </>}
      controller={controller}
      columns={colunms}
      data={records}
      formFields={formFields}
      formManager={formManager}
      pageTitle="Datos edafoclimáticos"
    />
    <DeleteModal show={openModal === "delete"} handleClose={handleClose} handleReload={loadAll} /> 
    <ImportWeatherData show={openModal === "import"} handleClose={handleClose} handleReload={loadAll} /> 
  </>
}

const DeleteModal = ({show, handleClose, handleReload}) => {
  const { showLoader, hideLoader } = useContext(LoaderContext)
  const { notify } = useToaster()

  const deleteForm = {
    resetter: (initial?: {
      dateRange: string;
    }) => {
      const now = new Date()
  
      return ({
        ...initial,
        dateRange: initial?.dateRange || [now, now],
      });
    },
    validator: {
      dateRange: ([start, end]) => {
        start = endOfDay(start)
        end = endOfDay(end)
        if (isEqual(start, end) || isAfter(start, end)) {
          throw new ValidationError('La fecha de inicio debe ser menor que la fecha de fin')
        }
      },
    },
  }
  deleteForm.manager = useFormManager(deleteForm.resetter, deleteForm.validator)
  const { remove } = useApiController(useAuth())
  deleteForm.handleSubmit = () => {
    let [start, end] = deleteForm.manager.data.dateRange
    start = endOfDay(start)
    end = endOfDay(end)
    const postData = {start, end}
    console.log(postData)
    showLoader()
    remove(Endpoints.WeatherData, {...postData})
      .then(({count}) => {
        handleReload()
        handleClose()
        notify(`${count} registros eliminados correctamente`, "success")
      })
      .catch(e => {
        console.error(e)
        notify("Error al eliminar los registros", "error")
      })
      .finally(() => {
        hideLoader()
      })
  }

  return <Modal show={show} onHide={handleClose} animation 
    onExit={() => {
    }}
    onExited={() => {
      deleteForm.manager.set(deleteForm.resetter())
    }}
  >
    <Modal.Header closeButton>
      <Modal.Title>¿Está seguro de eliminar los registros edafoclimáticos?</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <GenericFormReact manager={deleteForm.manager}>
        <FormField type="dateRange" name="dateRange" label="Rango de fechas a eliminar" />
      </GenericFormReact>
    </Modal.Body>
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
          disabled={deleteForm.manager.isValid()}
          onPress={() => {
            deleteForm.handleSubmit();
          }} 
        />
      </div>
    </Modal.Footer>
  </Modal>
}

const ImportWeatherData = ({show, handleClose}) => {
  const { showLoader, hideLoader } = useContext(LoaderContext)
  const { notify } = useToaster()

  const deleteForm = {
    resetter: (initial?: {
      file: string;
    }) => ({
      ...initial,
      file: initial?.file || [],
    }),
    validator: {
      file: v => {
        if (v?.length === 0) {
          throw new ValidationError('Debe seleccionar un archivo para cargar.')
        }
        // TODO Validar solo un archivo
        // TODO validar tipo
      },
    },
  }
  deleteForm.manager = useFormManager(deleteForm.resetter, deleteForm.validator)
  deleteForm.handleSubmit = () => {
    let [start, end] = deleteForm.manager.data.file
    start = endOfDay(start)
    end = endOfDay(end)
    const postData = {start, end}
    console.log(postData)
  }

  const uploader = React.useRef()
  const { UserData } = useContext(AuthContext)

  return <Modal show={show} onHide={handleClose} animation 
    onExit={() => {
    }}
    onExited={() => {
      deleteForm.manager.set(deleteForm.resetter())
    }}
  >
    <Modal.Header closeButton>
      <Modal.Title>Cargar datos edafoclimáticos desde archivo Excel o CSV</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <FormField ref={uploader} type="file" name="file" multiple={false}
        action={`${Endpoints.BaseURL}${Endpoints.WeatherData.substring(1)}`}
        label="Archivo CSV o Excel" 
        accept="text/csv,application/vnd.ms-excel"
        headers={{
          "Authorization": `Bearer ${UserData.access_token}`,
        }}
        onSuccess={({count}) => {
          notify(`${count} registros guardados correctamente`, "success")
          //console.log(response)
          hideLoader()
          handleClose()
        }}
        onError={error => {
          notify("Error al cargar el archivo", "success")
          console.error(error)
          hideLoader()
        }}
      />
      {/* <GenericFormReact manager={deleteForm.manager}>
      </GenericFormReact> */}
    </Modal.Body>
    <Modal.Footer>
      <div className="d-flex justify-content-end">
        <CircleIconButton 
          color='pink'
          title="Cancelar" 
          disabled={deleteForm.manager.isValid()}
          onPress={() => {
            deleteForm.handleSubmit();
          }} 
        />
        <Spacer />
        <CircleIconButton 
          title="Cargar"  
          icon="bi bi-check"
          onPress={() => {
            try {
              showLoader()
              uploader.current.start()
            } catch (e) {
              console.error(e)
            }
          }} 
        />
      </div>
    </Modal.Footer>
  </Modal>
}

