// utils/normalizeFlights.ts

export interface NormalizedLocation {
  code: string;
  label: string;     // Main display line – e.g., "Cairo, Egypt" or "Cairo International Airport (CAI)"
  subLabel?: string; // Secondary line – e.g., "Egypt" or "Cairo, Egypt"
  type: "CITY" | "AIRPORT";
}

interface RawLocation {
  iataCode: string;
  subType: "CITY" | "AIRPORT";
  name: string;
  detailedName?: string;
  address?: {
    countryCode: string;
    countryName?: string;
    cityName?: string;
  };
}

/**
 * Normalizes raw Amadeus location data into a clean, user-friendly format
 * Optimized for Google Flights-like display in dropdowns
 */
export function normalizeLocations(locations: RawLocation[]): NormalizedLocation[] {
  return locations.map((loc) => {
    const code = loc.iataCode;
    const city = loc.address?.cityName || loc.name || "";
    const country = loc.address?.countryName || loc.address?.countryCode || "";

    let label = "";
    let subLabel = "";

    if (loc.subType === "CITY") {
      // City format: "Cairo, Egypt"
      label = city ? `${city}, ${country}` : country;
      subLabel = "City";
    } else {
      // Airport format: "Cairo International Airport (CAI)"
      const airportName =
        loc.detailedName?.split("/")[0]?.trim() ||
        loc.name ||
        "Airport";

      label = `${airportName} (${code})`;
      subLabel = city ? `${city}, ${country}` : country;
    }

    return {
      code,
      label,
      subLabel: subLabel || undefined,
      type: loc.subType,
    };
  });
}