import React from "react";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { GoogleMapsProvider } from "./context/MapContext";
import { LoaderProvider } from "./context/LoaderContext";
import { AlertProvider } from "./context/Alerts/AlertProvider";
import { createRoot } from "react-dom/client"


const root = document.getElementById("root")
root && createRoot(root).render(
  <React.StrictMode>
    <LoaderProvider>
      <AlertProvider>
        <AuthProvider>
          <GoogleMapsProvider
            containerId="map-container"
            initialCoordinates={{ lat: 0, lng: 0 }}
            initialZoom={8}
          >
            <AlertProvider>
              <App />

            </AlertProvider>
          </GoogleMapsProvider>
        </AuthProvider>
      </AlertProvider>
    </LoaderProvider>
  </React.StrictMode>
);
