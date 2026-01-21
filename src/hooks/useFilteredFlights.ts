import { useMemo } from "react";
import type { FlightOffer } from "../types/flight.types";

interface FilterOptions {
  maxPrice: number;
  stops: "any" | "0" | "1" | "2";
  selectedAirlines: string[];
  selectedCabins: string[];
  departureTimeRange: [number, number];
  arrivalTimeRange: [number, number];
  directOnly: boolean;
}

export function useFilteredFlights(flights: FlightOffer[], filters: FilterOptions) {
  const { maxPrice, stops, selectedAirlines, selectedCabins, departureTimeRange, arrivalTimeRange, directOnly } = filters;

  return useMemo(() => {
    return flights.filter(flight => {
      const firstItinerary = flight.itineraries[0];
      if (!firstItinerary) return false;

      const segments = firstItinerary.segments;
      const flightStops = segments.length - 1;

      // Airline code (first segment)
      const airline = segments[0]?.carrierCode || "";

      // Cabin (first segment of first traveler)
      const cabin = flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || "";

      // Departure / Arrival hours
      const depHour = segments[0] ? new Date(segments[0].departure.at).getHours() : 0;
      const arrHour = segments.length ? new Date(segments[segments.length - 1].arrival.at).getHours() : 0;

      // Filters
      const matchesPrice = Number(flight.price.total) <= maxPrice;
      const matchesStops =
        stops === "any"
          ? true
          : stops === "2"
          ? flightStops >= 2
          : flightStops === Number(stops);
      const matchesAirline = selectedAirlines.length === 0 || selectedAirlines.includes(airline);
      const matchesCabin = selectedCabins.length === 0 || selectedCabins.includes(cabin);
      const matchesDepartureTime = depHour >= departureTimeRange[0] && depHour <= departureTimeRange[1];
      const matchesArrivalTime = arrHour >= arrivalTimeRange[0] && arrHour <= arrivalTimeRange[1];
      const matchesDirect = !directOnly || flightStops === 0;

      return matchesPrice && matchesStops && matchesAirline && matchesCabin && matchesDepartureTime && matchesArrivalTime && matchesDirect;
    });
  }, [flights, maxPrice, stops, selectedAirlines, selectedCabins, departureTimeRange, arrivalTimeRange, directOnly]);
}
