import axios from "axios";
import type { SearchParams } from "../components/search/SearchForm";

const API_BASE = "https://test.api.amadeus.com";

let accessToken: string | null = null;
let tokenExpiry = 0;

type FlightSearchQuery = {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  nonStop: boolean;
  travelClass: string;
};

// Get or refresh token
export async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;

  const res = await axios.post(
    `${API_BASE}/v1/security/oauth2/token`,
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: import.meta.env.VITE_AMADEUS_API_KEY!,
      client_secret: import.meta.env.VITE_AMADEUS_API_SECRET!,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  accessToken = res.data.access_token;
  tokenExpiry = Date.now() + res.data.expires_in * 1000;
  return accessToken||"";
}

// Search flights with full parameters
export async function searchFlights(params: SearchParams) {
  const token = await getAccessToken();

  const query: FlightSearchQuery = {
    originLocationCode: params.origin,
    destinationLocationCode: params.destination,
    departureDate: params.departureDate,
    adults: params.adults ?? 1,         // default 1
    children: params.children ?? 0,     // default 0
    nonStop: params.direct ?? false,    // default false
    travelClass: params.cabin ?? "ECONOMY", // default ECONOMY
  };

  if (params.returnDate) query.returnDate = params.returnDate;

  const res = await axios.get(`${API_BASE}/v2/shopping/flight-offers`, {
    headers: { Authorization: `Bearer ${token}` },
    params: query,
  });

  return res.data.data;
}
