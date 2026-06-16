"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// React-Leaflet requires the `window` object.
// Next.js App Router must dynamically import it with SSR explicitly disabled
// to prevent "window is not defined" crashes during the static build step.
const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-500">Loading Map...</div>
});

interface MapComponentProps {
  leads: Array<{
    id: string;
    ownerName: string;
    propertyAddress: string;
    latitude: number;
    longitude: number;
    noticeStatus: string;
  }>;
}

export function MapComponent({ leads }: MapComponentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <MapClient leads={leads} />;
}
