import React, { useContext, useEffect, useMemo, useState } from "react";
import { RadioTile } from "rsuite";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import _ from "lodash";

import { BaseLayout } from "../components/BaseLayout";
import { AppMenu } from "../Misc/Menu";
import { useCoontroller } from "../controllers/useController";
import { Endpoints } from "../../../Common/api/routes";
import { IProduccion } from "../../../Common/interfaces/models";
import { LoaderContext } from "../context/LoaderContext";
import { useApiController } from "../../../Common/api/useApi";
import { useAuth } from "../context/AuthContext";
import useToaster from "../hooks/useToaster";
import { formatNumber } from "../../../../../../Common/helpers/formats";


const MenuItem = ({ icon, title, link, children: description, ...props }) => {
  return (
    <Link to={link} className=" col-md-4 col-sm-6" style={{ textDecorationLine: "none" }}>
      <RadioTile icon={<i className={`bi ${icon}`} />} label={title}>
        {description}
      </RadioTile>
    </Link>
  );
}

export const Home = () => {
  const { records: _cosechas } = useCoontroller<IProduccion>(Endpoints.Produccion)
  const cosechas = useMemo(() => _.chain(_cosechas)
    .groupBy(c => c.Variedad.id)
    .map(group => _.chain(group)
      .sortBy(c => c.Fecha)
      .reverse()
      .value()
    )
    .map(group => _.chain(group)
      .filter(c => group[0].Fecha.substring(0,4) === c.Fecha.substring(0,4))
      .value()
    )
    .map(group => ({ ...group, 
      variedad: group[0].Variedad.Nombre,
      anio: Number(group[0].Fecha.substring(0,4)),
      lotes: group.length,
      total: _.chain(group)
        .sumBy(c => Number(c.Cantidad))
        .value()
    }))
    .sortBy(c => c.variedad)
    .value(), 
  [_cosechas])
  useEffect(() => { console.log({cosechas}) }, [cosechas])

  const { showLoader, hideLoader } = useContext(LoaderContext)
  const { get } = useApiController(useAuth());
  const { notify } = useToaster()

  const [ cosechasPredichas, setCosechasPredichas] = useState();
  useEffect(() => {
    (async () => {
      try {
        if (!cosechasPredichas) {
          showLoader()
          setCosechasPredichas( await (get(Endpoints.PrediccionesCosecha).then(({results}) => results)) )
        }
      } catch (error) {
        console.error(error)
        notify("Problema al cargar las estimaciones", "error");
      } finally {
        hideLoader()
      }
    })();
  }, [cosechasPredichas])

  return (
    <BaseLayout PageName="CCMANGOS">
      <div className="container" >
        <div className="row">
          <div className="col-md-3">
            <Card className="m-3">
              <Card.Header>Últimas Cosechas</Card.Header>
              <Card.Body className="row">
                {cosechas.map(c => 
                  <div class="col-sm-6">
                    <h6 className="text-center">{c.total} Kg</h6>
                    {c.variedad} en {c.anio}
                  </div>
                )}
              </Card.Body>
            </Card>
            
            <Card className="m-3">
              <Card.Header>Cosechas Pronosticadas</Card.Header>
              <Card.Body className="row">
                {cosechasPredichas && Object.entries(cosechasPredichas)
                  .map(([key, value]) => 
                    <div className="col-sm-6">
                      <h6 className="text-center">{formatNumber(
                        value.value[0] * (cosechas.find(c => c.variedad === key)?.lotes || 1)
                      )} Kg</h6>
                      {key}
                    </div>)
                }
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-9">
            {AppMenu.map((menu, index) => (
              <Card key={menu.title} className="m-3">
                <Card.Header>
                  <i className={`bi ${menu.icon}`} /> {menu.title}
                </Card.Header>
                <Card.Body className="row">
                  {menu.children.map((child, index) => (
                    <MenuItem key={index} {...child} children={child.description} />
                  ))}
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};
