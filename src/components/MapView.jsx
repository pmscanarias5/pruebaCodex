import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';

const WMS_URL =
  'https://servicios.idee.es/wms-inspire/riesgos-naturales/inundaciones';

export default function MapView() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return undefined;

    const baseLayer = new TileLayer({
      source: new OSM()
    });

    const floodLayer = new TileLayer({
      opacity: 0.65,
      source: new TileWMS({
        url: WMS_URL,
        params: {
          LAYERS: 'GN.InundacionT10',
          TILED: true
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous'
      })
    });

    const map = new Map({
      target: mapRef.current,
      layers: [baseLayer, floodLayer],
      view: new View({
        center: [-392126, 4926709],
        zoom: 6,
        projection: 'EPSG:3857'
      })
    });

    return () => map.setTarget(undefined);
  }, []);

  return <section ref={mapRef} className="map-container" aria-label="Mapa WMS" />;
}
