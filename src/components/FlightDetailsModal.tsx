// components/FlightDetailsModal.tsx
import { useEffect} from "react";
import type { FlightOffer } from "../types/flight.types";

interface FlightDetailsModalProps {
  flight: FlightOffer | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FlightDetailsModal({
  flight,
  isOpen,
  onClose,
}: FlightDetailsModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc, { capture: true });
    return () => window.removeEventListener("keydown", handleEsc, { capture: true });
  }, [isOpen, onClose]);

  if (!isOpen || !flight) return null;

  const itinerary = flight.itineraries?.[0];
  const segments = itinerary?.segments ?? [];
  const stops = segments.length - 1;

  const first = segments[0];
  const last = segments[segments.length - 1];

  const depCode = first?.departure.iataCode ?? "—";
  const arrCode = last?.arrival.iataCode ?? "—";

  const depTime = first?.departure.at
    ? new Date(first.departure.at).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const arrTime = last?.arrival.at
    ? new Date(last.arrival.at).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const duration = itinerary?.duration ? formatDuration(itinerary.duration) : "—";

  const price = flight.price;
  const traveler = flight.travelerPricings?.[0];
  const cabin = traveler?.fareDetailsBySegment?.[0]?.cabin ?? "—";
  const amenities = traveler?.fareDetailsBySegment?.[0]?.amenities ?? [];

  const currency = price?.currency ?? "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`
          relative w-full max-w-[92vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl
          bg-white/85 backdrop-blur-xl border border-white/40 
          rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden
          max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-300
        `}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-6 z-10 text-3xl sm:text-4xl text-gray-700 hover:text-gray-900 transition-colors"
          aria-label="Close flight details"
        >
          ×
        </button>

        {/* Header */}
        <div className="px-6 sm:px-8 pt-9 sm:pt-10 pb-5 sm:pb-6 border-b border-amber-100/50 bg-linear-to-r from-white/80 via-amber-50/30 to-white/80">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {first?.carrierCode ?? "—"} Flight Details
          </h2>
          <p className="text-lg sm:text-xl font-semibold text-amber-800">
            {depCode} → {arrCode}
          </p>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            {depTime} – {arrTime} • {duration} •{" "}
            {stops === 0 ? "Direct" : `${stops} stop${stops !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-7 md:px-9 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Price Section */}
          {price && (
            <div className="bg-amber-50/50 border border-amber-200/40 rounded-2xl p-5 sm:p-6 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-semibold text-amber-900 mb-4">
                Price Breakdown
              </h3>
              <div className="space-y-3 text-gray-800 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span>Base fare</span>
                  <span className="font-medium">
                    {price.base ?? "—"} {currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & fees</span>
                  <span className="font-medium">
                    {price.total && price.base
                      ? (Number(price.total) - Number(price.base)).toFixed(2)
                      : "—"}{" "}
                    {currency}
                  </span>
                </div>
                <div className="flex justify-between pt-4 border-t border-amber-200 font-bold text-base sm:text-lg">
                  <span>Total</span>
                  <span className="text-amber-800">
                    {price.total ?? "—"} {currency}
                  </span>
                </div>

                {price.additionalServices?.length ? (
                  <div className="mt-4 pt-3 border-t border-amber-100 text-xs sm:text-sm">
                    <p className="font-medium text-gray-700 mb-2">Additional services:</p>
                    <ul className="space-y-1.5 pl-4 list-disc">
                      {price.additionalServices.map((svc, i) => (
                        <li key={i}>
                          {svc.type.replace(/_/g, " ")}: {svc.amount} {currency}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Cabin & Baggage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div className="bg-white/70 rounded-2xl p-5 sm:p-6 border border-gray-200/40 shadow-sm">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                Cabin Class
              </h4>
              <p className="text-2xl font-medium text-amber-800">
                {cabin.replace(/_/g, " ")}
              </p>
            </div>

            <div className="bg-white/70 rounded-2xl p-5 sm:p-6 border border-gray-200/40 shadow-sm">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                Baggage Allowance
              </h4>
              <div className="text-gray-700 text-base leading-relaxed">
                <p>
                  Cabin: {traveler?.fareDetailsBySegment?.[0]?.includedCabinBags?.quantity ?? 0}
                </p>
                <p>
                  Checked:{" "}
                  {traveler?.fareDetailsBySegment?.[0]?.includedCheckedBags?.quantity ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="bg-white/70 rounded-2xl p-5 sm:p-6 border border-gray-200/40 shadow-sm">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Included Services
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                {amenities.map((amenity, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-amber-600 text-xl mt-0.5">•</span>
                    <div>
                      <span className="font-medium">{amenity.description}</span>
                      {amenity.isChargeable && (
                        <span className="ml-2 text-xs text-amber-700">(chargeable)</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Booking Meta */}
          <div className="bg-amber-50/30 rounded-2xl p-5 sm:p-6 border border-amber-200/30 text-sm text-gray-700">
            <h4 className="text-base sm:text-lg font-semibold text-amber-900 mb-3">
              Booking Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              <p>
                Last ticketing date:{" "}
                <strong>{flight.lastTicketingDate ?? "—"}</strong>
              </p>
              <p>
                Bookable seats:{" "}
                <strong>{flight.numberOfBookableSeats ?? "—"}</strong>
              </p>
              <p>
                Validating carrier:{" "}
                <strong>{flight.validatingAirlineCodes?.[0] ?? "—"}</strong>
              </p>
              <p>
                Source: <strong>{flight.source ?? "—"}</strong>
              </p>
              <p>
                Instant ticketing:{" "}
                <strong>{flight.instantTicketingRequired ? "Yes" : "No"}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-5 sm:py-6 border-t border-gray-200/50 bg-white/60 backdrop-blur-sm flex flex-col-reverse sm:flex-row gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-7 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-full transition-colors shadow-sm order-2 sm:order-1"
          >
            Close
          </button>
          <button
            className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 order-1 sm:order-2"
          >
            Book this flight
          </button>
        </div>
      </div>
    </div>
  );
}

// Same helper used in FlightCard
function formatDuration(iso: string): string {
  const match = iso.match(/P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso;

  const [, d, h, m] = match;
  const parts: string[] = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  return parts.join(" ") || "—";
}