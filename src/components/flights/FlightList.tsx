// components/flights/FlightList.tsx
import { useState } from "react";
import type { FlightOffer } from "../../types/flight.types";
import FlightCard from "./FlightCard";
import FlightDetailsModal from "../FlightDetailsModal";

interface Props {
  flights: FlightOffer[];
  isLoading?: boolean; // Optional: pass true while fetching
}

export default function FlightList({ flights, isLoading = false }: Props) {
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(
    null,
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl shadow-lg p-6 animate-pulse h-64"
          />
        ))}
      </div>
    );
  }

  if (!flights.length) {
    return (
      <div className="flex  flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-100/50 flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
          No flights found
        </h3>
        <p className="text-gray-600 text-lg max-w-md">
          Try adjusting your dates, destinations, or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8  ">
      {/* Optional header */}
      <div className="flex bg-gray-600/30 border border-amber-600/10 justify-between items-center mb-6 px-2 py-2 rounded-t-2xl">
        <h2 className="text-2xl font-bold text-amber-600">
          {flights.length} {flights.length === 1 ? "Flight" : "Flights"} Found
        </h2>
        <p className="text-sm text-amber-500">
          Sorted by price • {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Flight cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {flights.map((flight) => (
          <div
            key={flight.id}
            className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          >
            <FlightCard
              key={flight.id}
              flight={flight}
              onViewDetails={setSelectedFlight}
            />

          </div>
        ))}
      </div>
        <FlightDetailsModal
          flight={selectedFlight}
          isOpen={!!selectedFlight}
          onClose={() => setSelectedFlight(null)}
        />
    </div>
  );
}
