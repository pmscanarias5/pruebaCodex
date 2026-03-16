import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';

const WMS_URL =
  'https://servicios.idee.es/wms-inspire/riesgos-naturales/inundaciones';

export default function MapView() {
  const mapRef = useRef(null);
  const floodLayerRef = useRef(null);
  const [isWmsVisible, setIsWmsVisible] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  useEffect(() => {
    if (!mapRef.current) return undefined;

    const baseLayer = new TileLayer({
      source: new OSM()
    });

    const floodLayer = new TileLayer({
      visible: isWmsVisible,
      opacity: 0.65,
      source: new TileWMS({
        url: WMS_URL,
        params: {
          LAYERS: 'NZ.Flood.FluvialT10',
          TILED: true
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous'
      })
    });

    floodLayerRef.current = floodLayer;

    const map = new Map({
      target: mapRef.current,
      layers: [baseLayer, floodLayer],
      view: new View({
        center: [-392126, 4926709],
        zoom: 6,
        projection: 'EPSG:3857'
      })
    });

    return () => {
      floodLayerRef.current = null;
      map.setTarget(undefined);
    };
  }, []);

  useEffect(() => {
    if (!floodLayerRef.current) return;
    floodLayerRef.current.setVisible(isWmsVisible);
  }, [isWmsVisible]);

  return (
    <section className="map-wrapper">
      <aside className="layers-panel" aria-label="Panel de capas">
        <button
          type="button"
          className="layers-toggle"
          aria-expanded={isPanelOpen}
          aria-controls="layers-panel-content"
          onClick={() => setIsPanelOpen((current) => !current)}
        >
          Capas
        </button>
        {isPanelOpen && (
          <div id="layers-panel-content" className="layers-content">
            <label htmlFor="toggle-flood-layer" className="layer-option">
              <input
                id="toggle-flood-layer"
                type="checkbox"
                checked={isWmsVisible}
                onChange={(event) => setIsWmsVisible(event.target.checked)}
              />
              Inundaciones (WMS)
            </label>
          </div>
        )}
      </aside>
      <div ref={mapRef} className="map-container" aria-label="Mapa WMS" />
    </section>
  );
}
