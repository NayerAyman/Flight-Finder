// components/FlightCard.tsx
import type { FlightOffer } from "../../types/flight.types"; // assuming Flight = FlightOffer from Amadeus
 // adjust path as needed

interface FlightCardProps {
  flight: FlightOffer;
  onViewDetails: (flight: FlightOffer) => void;
}

export default function FlightCard({ flight ,onViewDetails }: FlightCardProps) {

  const itinerary = flight.itineraries?.[0];
  const segments = itinerary?.segments ?? [];
  const stops = segments.length - 1;

  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  const departureAirport = firstSegment?.departure.iataCode ?? "—";
  const arrivalAirport = lastSegment?.arrival.iataCode ?? "—";

  const departureTime = firstSegment?.departure.at
    ? new Date(firstSegment.departure.at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const arrivalTime = lastSegment?.arrival.at
    ? new Date(lastSegment.arrival.at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  // Use Amadeus provided duration
  const duration = itinerary?.duration
    ? formatDuration(itinerary.duration)
    : "—";

  const carrierCode = firstSegment?.carrierCode ?? "—";
  const cabin =
    flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin ?? "Economy";

  return (
    <>
      <div
        className={`
          bg-white/75 backdrop-blur-lg border border-white/60 
          rounded-3xl shadow-lg p-5 sm:p-6 
          hover:shadow-xl transition-all duration-300
          flex flex-col h-full
        `}
      >
        {/* Airline + Price */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <h3 className="font-bold text-xl text-gray-900">
              {carrierCode}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {stops === 0 ? "Direct" : `${stops} stop${stops > 1 ? "s" : ""}`}
            </p>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-amber-700">
              {flight.price?.total ?? "—"}
              <span className="text-base font-normal text-gray-500 ml-1">
                {flight.price?.currency ?? ""}
              </span>
            </p>
          </div>
        </div>

        {/* Route + times */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="text-center flex-1">
            <div className="text-2xl font-semibold text-gray-900">
              {departureAirport}
            </div>
            <div className="text-sm text-gray-600 mt-1">{departureTime}</div>
          </div>

          <div className="flex flex-col items-center text-gray-400 text-sm">
            <div className="w-16 sm:w-24 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent my-1" />
            <span>{duration}</span>
          </div>

          <div className="text-center flex-1">
            <div className="text-2xl font-semibold text-gray-900">
              {arrivalAirport}
            </div>
            <div className="text-sm text-gray-600 mt-1">{arrivalTime}</div>
          </div>
        </div>

        {/* Cabin + CTA */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100/70">
          <span className="px-3 py-1 bg-amber-100/80 text-amber-800 rounded-full text-sm font-medium">
            {cabin.replace("_", " ")}
          </span>

          <button
            onClick={() => onViewDetails(flight)}
            className={`
              px-5 py-2.5 bg-amber-600 hover:bg-amber-700 
              text-white font-medium rounded-full 
              transition-all duration-200 shadow-md hover:shadow-lg
              active:scale-95 text-sm sm:text-base
            `}
            aria-label={`View details for ${departureAirport} to ${arrivalAirport} flight`}
          >
            View Details
          </button>
        </div>
      </div>


    </>
  );
}

// Small helper – PTnHnM → "3h 45m"
function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return isoDuration;

  const [, days, hours, minutes] = match;
  const parts: string[] = [];

  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);

  return parts.join(" ") || "—";
}