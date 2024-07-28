import React, { useEffect } from 'react';
import { Map, GoogleApiWrapper, Polygon, IMapProps as GoogleMapProps } from 'google-maps-react';

interface MapPolygon {
  paths: google.maps.LatLngLiteral[];
  options?: google.maps.PolygonOptions;
}

interface MapContainerProps extends GoogleMapProps {
  initialCenter: google.maps.LatLngLiteral;
  polygons: MapPolygon[]
}

const MapContainer: React.FC<MapContainerProps> = ({ google, initialCenter, polygons }) => {
  useEffect(() => {
    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: initialCenter,
      zoom: 12,
    });

    polygons.forEach((polygon, index) => {
      new google.maps.Polygon({
        paths: polygon.paths,
        map,
        ...polygon.options,
      });
    });
  }, [google, initialCenter, polygons]);

  return (
    <div id="map" style={{ width: '100%', height: '400px' }}></div>
  );
};

export const GoogleMap = GoogleApiWrapper({
  apiKey:  process.env.REACT_APP_GOOGLE_API, // Reemplaza con tu clave de API real
})(MapContainer)

export default GoogleApiWrapper({
  apiKey:  process.env.REACT_APP_GOOGLE_API, // Reemplaza con tu clave de API real
})(MapContainer);
