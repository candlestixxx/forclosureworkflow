export async function geocodeAddress(address: string, city: string | null | undefined, zip: string | null | undefined): Promise<{ lat: number, lon: number } | null> {
  try {
    let query = address;
    if (city) query += `, ${city}`;
    if (zip) query += ` ${zip}`;

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Foreclosure-CRM-MVP/1.1'
      }
    });

    if (!response.ok) return null;

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }

    return null;
  } catch (error) {
    console.error("Geocoding failed for:", address, error);
    return null;
  }
}
