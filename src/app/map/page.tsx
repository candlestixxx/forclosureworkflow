import { prisma } from "@/lib/prisma";
import { MapComponent } from "@/components/MapComponent";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  // Only fetch leads that have valid geocoordinates
  const leads = await prisma.lead.findMany({
    where: {
      latitude: { not: null },
      longitude: { not: null }
    },
    select: {
      id: true,
      ownerName: true,
      propertyAddress: true,
      latitude: true,
      longitude: true,
      noticeStatus: true,
    }
  });

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Geospatial Mapping</h1>
        <p className="text-sm text-gray-600">Visualizing high-density foreclosure zones.</p>
      </div>
      <div className="flex-1 min-h-0">
        <MapComponent leads={leads as any} />
      </div>
    </div>
  );
}
