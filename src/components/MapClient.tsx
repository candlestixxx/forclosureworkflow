"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";

// Fix Leaflet's missing icon images in Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapClientProps {
  leads: Array<{
    id: string;
    ownerName: string;
    propertyAddress: string;
    latitude: number;
    longitude: number;
    noticeStatus: string;
  }>;
}

export default function MapClient({ leads }: MapClientProps) {
  const centerLat = leads.length > 0 ? leads[0].latitude : 42.5; // Default near Macomb
  const centerLon = leads.length > 0 ? leads[0].longitude : -83.0;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
      <MapContainer
        center={[centerLat, centerLon]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {leads.map((lead) => (
          <Marker
            key={lead.id}
            position={[lead.latitude, lead.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{lead.ownerName}</p>
                <p className="text-gray-600 mb-2">{lead.propertyAddress}</p>
                <Link href={`/leads/${lead.id}`} className="text-blue-600 hover:underline">
                  View Lead Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
