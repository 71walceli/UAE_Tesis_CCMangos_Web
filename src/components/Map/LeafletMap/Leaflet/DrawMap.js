import React, { useEffect, useState, useMemo } from "react";

import L, { point } from "leaflet";
import { MapContainer, TileLayer, FeatureGroup, useMap, Polygon, Tooltip } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import osm from "./osm-providers";

import { getArea, getCenter, getLength } from "../../../../../../Common/utils/polygons";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

const LeafletContext = () => {
  const map = useMap()
  useEffect(() => {
    console.log(map._layers)
  }, [map._layers])
}

const DEFAULT_CENTER = { lat: -2.368, lng: -80.2721 };

export const DrawMap = ({value, onChange, otherRegions, error, ...props}) => {
  const [center, setCenter] = useState();
  //const [layer, setLayer] = useState({});

  const polygon = useMemo(() => {
    if (value?.points?.length > 0) {
      const newCenter = getCenter(value.points);
      console.log({newCenter});
      setCenter(newCenter);
      return { ...value, points: value.points.map(point => ({...point}) )};
    } else {
      setCenter(DEFAULT_CENTER);
      return { points: [], name: "" };
    }
  }, []);
  const [_value, _onChange] = useState(polygon);
  /* const [polygon, setPolygon] = useState(value?.points?.length > 0 
    ?value 
    :{ points: [], name: "" }
  ); */
  
  useEffect(() => {
    if (value?.points?.length > 0) {
      const newCenter = getCenter(value.points);
      console.log({newCenter});
      setCenter(newCenter);
    } else {
      setCenter(DEFAULT_CENTER);
    }
  }, [value]);
  const ZOOM_LEVEL = 14;
  const mapRef = useRef();

  const handlePolygonCreated = (e) => {
    console.log(e);
    const { layer } = e;
    const polygon = layer.toGeoJSON();
    const latlngs = polygon.geometry.coordinates[0].map((item) => ({ lng: item[0], lat: item[1] }));
    console.log(latlngs);
    onChange({points: latlngs});
    _onChange({points: latlngs});
  };

  const handlePolygonEdited = e => {
    console.log(e);
    const layers = e.layers;
    layers.eachLayer((layer) => {
      const polygon = layer.toGeoJSON();
      const latlngs = polygon.geometry.coordinates[0].map((item) => ({ lng: item[0], lat: item[1] }));
      onChange({ points: latlngs });
      _onChange({ points: latlngs });
    });
  };
  const handlePolygonDeletion = () => {
    onChange({});
    _onChange({});
  };

  const editOptions = {
    rectangle: false,
    circle: false,
    circlemarker: false,
    marker: false,
    polygon: true,
    polyline: false,
    edit: false,
  };

  return (
    <>
      {center
        ?<MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef} scrollWheelZoom={false}
          style={{ minHeight: 400, width: "100%" }}
        >
          {/* <LeafletContext /> */}
          {otherRegions?.map(polygon => <Polygon positions={polygon.points} color={polygon.color}>
            <Tooltip>
              {polygon.name}
              <br />
              {getArea(polygon.points) / 10000} Ha.
              <br />
              {getLength(polygon.points)} Km
            </Tooltip>
          </Polygon>)
          }
          <FeatureGroup>
            <Polygon positions={polygon.points} color="green">
              <Tooltip>
                {polygon.name}
                <br />
                {getArea(polygon.points) / 10000} Ha.
                <br />
                {getLength(polygon.points)} Km
              </Tooltip>
            </Polygon>
            <EditControl 
              position="topright"
              onCreated={handlePolygonCreated}
              onEdited={handlePolygonEdited}
              onDeleted={handlePolygonDeletion}
              draw={{ ...editOptions, polygon: (_value?.points?.length || 0) < 3, }}
            />
            }
          </FeatureGroup>
          <TileLayer
            url={osm.maptiler.url}
            attribution={osm.maptiler.attribution}
          />
          {error 
            ?<div 
              style={{
                position: "absolute",
                bottom: 15,
                right: 0,
                padding: 10,
                backgroundColor: "white",
                color: "red",
                zIndex: 1000,
              }}
            >
              {error}
            </div>
            :null
          }
          {/* <CoordinatesControl /> */}
          <MapEvents />
        </MapContainer>
        :null
      }
    </>
  );
};

const MapEvents = () => {
  const [coordinates, setCoordinates] = useState();

  const map = useMap();
  useEffect(() => {
    const callback = (e) => {
      setCoordinates({ lat: e.latlng.lat, lng: e.latlng.lng });
    };
    const onEvent = (event) => {
      map.on(event, callback);
    }
    onEvent("mousemove");
    /* map.on("mouseover", (e) => {
      console.log({...e.latlng, event: "hover"});
      setCoordinates({ lat: e.latlng.lat, lng: e.latlng.lng });
    }); */
  }, [map]);
  
  return (
    <div>
      {coordinates 
        ?<div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          padding: 10,
          backgroundColor: "white",
          zIndex: 1000,
        }}>
          Lat: {coordinates.lat}
          <br />
          Lng: {coordinates.lng}
        </div> 
        :null
      }
    </div>
  );
}
