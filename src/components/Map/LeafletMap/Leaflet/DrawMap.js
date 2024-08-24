import React, { useEffect, useState, useMemo } from "react";


import L from "leaflet";
import { MapContainer, TileLayer, FeatureGroup, useMap, Polygon, Marker as LlMarker, Tooltip } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import osm from "./osm-providers";

import { getArea, getCenter, getLength } from "../../../../../../Common/utils/polygons";
import { formatNumber } from "../../../../../../Common/helpers/formats";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

const MapCenterer = ({center, zoom}) => {
  const map = useMap()
  
  useEffect(() => {
    if (!map) {
      return;
    }
    if (!center || !center.lng || !center.lat) {
      return;
    }
    console.log({center, zoom});
    map.setView(center, zoom || map.getZoom());
  }, [center, map, zoom]);
}

const DEFAULT_CENTER = { lat: -2.368, lng: -80.2721 };
const DEFAULT_ZOOM_LEVEL = 14;

export const DrawMap = ({
  value, onChange, otherRegions, error, label, type, required, center, zoom,
  ...props
}) => {
  if (!type) {
    throw new Error("Type is required");
  }
  const [ _center, _setCenter ] = useState(() => {
    if (center && center.lng && center.lat) {
      return center;
    }
    if (value?.points?.length > 0) {
      const newCenter = type === "polygon" ? getCenter(value.points) : value.points[0];
      console.log({newCenter});
      return newCenter;
    }
    return DEFAULT_CENTER;
  });
  useEffect(() => {
    if (center && center.lng && center.lat) {
      _setCenter(center);
    }
  }, [center]);

  const [ _zoom, _setZoom ] = useState(zoom || DEFAULT_ZOOM_LEVEL);
  useEffect(() => {
    if (zoom) {
      _setZoom(zoom);
    }
  }, [zoom]);

  const shape = useMemo(() => {
    console.log({value});
    if (value?.points?.length > 0) {
      return { ...value, points: value.points.map(point => ({...point}) )};
    } else {
      return { points: [], name: "" };
    }
  }, []);
  const [_value, _onChange] = useState(shape);
  
  const mapRef = useRef();

  const handlePolygonCreated = (e) => {
    console.log(e);
    const { layer } = e;
    const polygon = layer.toGeoJSON();
    console.log({polygon});
    const latlngs = type === "polygon" 
      ? polygon.geometry.coordinates[0].map((item) => ({ lng: item[0], lat: item[1] }))
      : type === "point"
      ? [{
        lat: polygon.geometry.coordinates[1],
        lng: polygon.geometry.coordinates[0],
      }]
      : null
    ;
    console.log({latlngs});
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
    marker: type === "point" && (_value?.points?.length || 0) < 1,
    polygon: type === "polygon" && (_value?.points?.length || 0) < 3,
    polyline: false,
  };

  return (
    <>
      <MapContainer center={_center} zoom={_zoom} ref={mapRef} scrollWheelZoom={false}
        style={{ minHeight: 400, width: "100%" }}
      >
        <MapCenterer center={_center} zoom={_zoom} />
        {otherRegions?.filter(shape => shape.type === "polygon").map(shape => (
          <Polygon key={shape.name} id={shape.name} positions={shape.points} color={shape.color}>
            <Tooltip>
              {shape.name}
              <br />
              {getArea(shape.points) / 10000} Ha.
              <br />
              {getLength(shape.points)} Km
            </Tooltip>
          </Polygon>
        ))}
        {otherRegions?.filter(shape => shape.type === "point").map(shape => (
          <Polygon key={shape.name} id={shape.name} positions={shape.points} color={shape.color} /* size={[10,10]} */>
            <Tooltip>{shape.name}</Tooltip>
          </Polygon>
        ))}
        <FeatureGroup>
          <EditControl 
            position="topright"
            onCreated={handlePolygonCreated}
            onEdited={handlePolygonEdited}
            onDeleted={handlePolygonDeletion}
            draw={editOptions}
          />
          {shape?.points?.length > 0 && type === "polygon"
            ?<Polygon id={shape.name} positions={shape.points} color="green">
              <Tooltip>
                {shape.name}
                <br />
                {getArea(shape.points) / 10000} Ha.
                <br />
                {getLength(shape.points)} Km
              </Tooltip>
            </Polygon>
            :null
          }
          {shape?.points?.length > 0 && type === "point"
            ?<LlMarker id={shape.name} position={shape.points[0]} color="green">
              <Tooltip>
                {shape.name}
                <br />
                {getArea(shape.points) / 10000} Ha.
                <br />
                {getLength(shape.points)} Km
              </Tooltip>
            </LlMarker>
            :null
          }
        </FeatureGroup>
        <TileLayer
          url={osm.maptiler.url}
          attribution={osm.maptiler.attribution}
        />

        {/* Over the map controls */}
        {label && <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            paddingLeft: 50,
            paddingRight: 50,
          }}
        >
          <label style={{
            padding: 10,
            backgroundColor: "#ffffffcc",
            zIndex: 1000,
            borderEndEndRadius: 10,
            borderEndStartRadius: 10,
          }}>
            {label} {required && <span className="text-danger">*</span>}
          </label>
        </div>}
        {error 
          ?<div 
            style={{
              position: "absolute",
              bottom: 17,
              right: 0,
              padding: 10,
              backgroundColor: "#ffffffcc",
              color: "red",
              zIndex: 1000,
              borderStartStartRadius: 10,
            }}
          >
            {error}
          </div>
          :null
        }
        {/* <CoordinatesControl /> */}
        <MouseTracker />
      </MapContainer>
    </>
  );
};

const MouseTracker = () => {
  const map = useMap();
  const [coordinates, setCoordinates] = useState(map.getCenter());

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
          backgroundColor: "#ffffffcc",
          zIndex: 1000,
          borderStartEndRadius: 10,
        }}>
          Lat: {formatNumber(coordinates.lat, 6)}
          <br />
          Lng: {formatNumber(coordinates.lng, 6)}
        </div> 
        :null
      }
    </div>
  );
}
