import { useState } from "react";
import { searchFlights } from "../services/flights.service";
import type { FlightOffer } from "../types/flight.types";

interface FetchFlightsParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  cabin?: string;
  direct?: boolean;
}

export default function useFlights() {
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFlights = async ({
    origin,
    destination,
    departureDate,
    returnDate,
    adults = 1,
    children = 0,
    cabin = "ECONOMY",
    direct = false,
  }: FetchFlightsParams): Promise<void> => {
    setLoading(true);
    try {
      const data: FlightOffer[] = await searchFlights({
        origin,
        destination,
        departureDate,
        returnDate,
        adults,
        children,
        cabin,
        direct,
      });
      setFlights(data);
    } catch (err) {
      console.error("Error fetching flights:", err);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  return { flights, fetchFlights, loading };
}
