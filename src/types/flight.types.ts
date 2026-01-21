// src/types/flight.types.ts

/**
 * Amadeus Flight Offer (from Flight Offers Search API v2)
 * Main response item in /v2/shopping/flight-offers
 */
export interface FlightOffer {
  /** Unique identifier of this flight offer */
  id: string;

  /** Always "flight-offer" */
  type: "flight-offer";

  /** Source of the offer: usually "GDS" or "airline" */
  source: string;

  /** Whether the offer requires instant ticketing */
  instantTicketingRequired: boolean;

  /** Whether the offer contains non-homogeneous itineraries (different rules per traveler) */
  nonHomogeneous: boolean;

  /** One-way flight (true) vs round-trip/multi-city (false) */
  oneWay: boolean;

  /** Last date on which this offer can be booked (YYYY-MM-DD) */
  lastTicketingDate?: string;

  /** Last date & time (more precise) – ISO 8601 */
  lastTicketingDateTime?: string;

  /** Number of remaining bookable seats for this offer */
  numberOfBookableSeats: number;

  /** List of itineraries (outbound, return, etc.) */
  itineraries: Itinerary[];

  /** Price information for the offer */
  price: Price;

  /** Pricing per traveler type (adult, child, etc.) */
  travelerPricings: TravelerPricing[];

  /** IATA airline codes that can validate/ticket this offer */
  validatingAirlineCodes?: string[];

  /** Optional – sometimes present in branded fares / additional info */
  additionalServices?: AdditionalService[];

  // Optional fields sometimes returned
  travelerClassifications?: string[];
  fareRules?: unknown[]; // rarely used in search, more in pricing/booking
}

/**
 * A single journey (e.g. outbound or return leg)
 */
export interface Itinerary {
  /** Total duration of this itinerary in ISO 8601 duration format (e.g. "PT5H30M", "P1DT2H") */
  duration: string;

  /** Sequence of flight segments */
  segments: Segment[];
}

/**
 * A single flight segment (one takeoff & landing)
 */
export interface Segment {
  /** Internal segment ID (useful for fare rules linking) */
  id?: string;

  /** Flight number (e.g. "FR1234") */
  number: string;

  /** Marketing carrier (airline shown to passenger) */
  carrierCode: string;

  /** Aircraft type code (e.g. "320", "77W") */
  aircraft: {
    code: string;
  };

  /** Departure information */
  departure: {
    iataCode: string;
    terminal?: string;
    at: string; // ISO 8601 datetime e.g. "2025-12-24T10:35:00"
  };

  /** Arrival information */
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string; // ISO 8601 datetime
  };

  /** Duration of THIS segment only (ISO 8601) */
  duration: string;

  /** Number of stops during this segment (usually 0) */
  numberOfStops: number;

  /** Operating carrier (if different from marketing) */
  operating?: {
    carrierCode: string;
  };

  /** Blacklisted in EU261 context (very rarely used) */
  blacklistedInEU?: boolean;
}

/**
 * Price structure (main offer price + breakdowns)
 */
export interface Price {
  /** Currency code (ISO 4217) */
  currency: string;

  /** Total price including all taxes, fees, etc. */
  total: string;

  /** Base fare before taxes & carrier surcharges */
  base: string;

  /** Sometimes used instead of total (legacy) */
  grandTotal?: string;

  /** Additional optional services included/available */
  additionalServices?: AdditionalService[];
}

/**
 * Additional service (bags, seats, etc.)
 */
export interface AdditionalService {
  type: string; // e.g. "CHECKED_BAGS", "SEAT_SELECTION", "MEAL"
  amount: string;
}

/**
 * Pricing & fare details per traveler
 */
export interface TravelerPricing {
  /** Traveler reference ID (matches traveler in booking) */
  travelerId: string; // usually "1", "2", ...

  /** Type of traveler */
  travelerType: "ADULT" | "CHILD" | "SENIOR" | "INFANT";

  /** Fare option selected */
  fareOption: "STANDARD" | "PLUS" | "FLEX" | string;

  /** Price for this traveler (sometimes duplicated from offer.price) */
  price: Price;

  /** Fare details broken down per segment */
  fareDetailsBySegment: FareDetailsBySegment[];
}

/**
 * Fare rules & inclusions per segment per traveler
 */
export interface FareDetailsBySegment {
  /** Links to the segment.id this fare applies to */
  segmentId: string;

  /** Cabin class */
  cabin: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";

  /** Booking class (single letter) */
  "class": string;

  /** Fare basis code (used for rules lookup) */
  fareBasis: string;

  /** Included cabin (hand) baggage */
  includedCabinBags?: {
    quantity: number;
    weight?: number;
    weightUnit?: "KG" | "LB";
  };

  /** Included checked baggage */
  includedCheckedBags?: {
    quantity: number;
    weight?: number;
    weightUnit?: "KG" | "LB";
  };

  /** Amenities & services (baggage, seats, meals, wifi, etc.) */
  amenities?: Amenity[];
}

export interface Amenity {
  description: string;
  isChargeable: boolean;
  amenityType: "BAGGAGE" | "MEAL" | "SEAT" | "ENTERTAINMENT" | "OTHER" | string;
}