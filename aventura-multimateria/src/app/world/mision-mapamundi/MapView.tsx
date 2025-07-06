import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

export default function MapView({ mapKey }: { mapKey: string }) {
  return (
    <MapContainer
      key={mapKey}
      center={[41.3874, 2.1686]}
      zoom={10}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[41.3874, 2.1686]}>
        <Popup>
          ¡Hola! Este es Barcelona.
        </Popup>
      </Marker>
    </MapContainer>
  );
} 