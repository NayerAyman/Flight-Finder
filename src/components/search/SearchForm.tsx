

import { useState, useEffect, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import axios, { AxiosError } from "axios";
import { debounce } from "lodash";
import { getAccessToken } from "../../services/flights.service";
import { normalizeLocations } from "../../utils/normalizeFlights";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  cabin?: string;
  direct?: boolean;
}

interface Props {
  onSearch: (params: SearchParams) => Promise<void>;
  resultsRef?: React.RefObject<HTMLDivElement | null>;
}

export interface Suggestion {
  code: string;      // IATA code sent to API
  label: string;     // main line in dropdown
  subLabel?: string; // secondary line
  type: "CITY" | "AIRPORT";
  display: string;   // what appears in input after selection
}

// ────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────

export default function SearchForm({ onSearch, resultsRef }: Props) {
  // ── Origin / Destination (display + hidden code) ────────────────────────
  const [originDisplay, setOriginDisplay] = useState("");
  const [originCode, setOriginCode] = useState("");
  const [destinationDisplay, setDestinationDisplay] = useState("");
  const [destinationCode, setDestinationCode] = useState("");

  // ── Other fields ────────────────────────────────────────────────────────
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [cabin, setCabin] = useState("ECONOMY");
  const [direct, setDirect] = useState(false);

  // ── Errors & loading ────────────────────────────────────────────────────
  const [originError, setOriginError] = useState("");
  const [destinationError, setDestinationError] = useState("");
  const [departureError, setDepartureError] = useState("");
  const [returnError, setReturnError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ── Autocomplete state ──────────────────────────────────────────────────
  const [originSuggestions, setOriginSuggestions] = useState<Suggestion[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<Suggestion[]>([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const [activeOriginIndex, setActiveOriginIndex] = useState(-1);
  const [activeDestIndex, setActiveDestIndex] = useState(-1);

  const originRef = useRef<HTMLDivElement | null>(null);
  const destRef = useRef<HTMLDivElement | null>(null);
  const originInputRef = useRef<HTMLInputElement>(null);
  const destInputRef = useRef<HTMLInputElement>(null);

  // ── Close dropdowns on outside click ────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        originRef.current && !originRef.current.contains(e.target as Node) &&
        destRef.current && !destRef.current.contains(e.target as Node)
      ) {
        setShowOriginDropdown(false);
        setShowDestDropdown(false);
        setActiveOriginIndex(-1);
        setActiveDestIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Fetch suggestions using normalizeLocations ──────────────────────────
  const fetchSuggestions = async (keyword: string): Promise<Suggestion[]> => {
    if (keyword.length < 2) return [];

    try {
      const token = await getAccessToken();

      const res = await axios.get(
        "https://test.api.amadeus.com/v1/reference-data/locations",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            keyword,
            subType: "AIRPORT,CITY",
            "page[limit]": 10,
          },
        }
      );

      const raw = res.data.data || [];
      const normalized = normalizeLocations(raw);

      // Map to internal Suggestion shape
      return normalized.map((item) => ({
        code: item.code,
        label: item.label,
        subLabel: item.subLabel,
        type: item.type,
        display: item.subLabel
          ? `${item.label.split(",")[0].trim()} (${item.code})`
          : `${item.label} (${item.code})`,
      }));
    } catch (err) {
      console.error("Location search failed:", err);
      return [];
    }
  };

  const debouncedFetch = useRef(
    debounce(async (value: string, field: "origin" | "destination") => {
      const suggestions = await fetchSuggestions(value);
      if (field === "origin") {
        setOriginSuggestions(suggestions);
        setShowOriginDropdown(true);
        setActiveOriginIndex(-1);
      } else {
        setDestSuggestions(suggestions);
        setShowDestDropdown(true);
        setActiveDestIndex(-1);
      }
    }, 300)
  ).current;

  // ── Input change handler ────────────────────────────────────────────────
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: "origin" | "destination"
  ) => {
    const value = e.target.value;

    if (apiError) setApiError("");

    if (field === "origin") {
      setOriginDisplay(value);
      setOriginError("");
      setActiveOriginIndex(-1);
    } else {
      setDestinationDisplay(value);
      setDestinationError("");
      setActiveDestIndex(-1);
    }

    if (value.trim().length >= 2) {
      debouncedFetch(value.trim(), field);
    } else {
      if (field === "origin") {
        setOriginSuggestions([]);
        setShowOriginDropdown(false);
      } else {
        setDestSuggestions([]);
        setShowDestDropdown(false);
      }
    }
  };

  // ── Keyboard navigation ─────────────────────────────────────────────────
  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    field: "origin" | "destination"
  ) => {
    const suggestions = field === "origin" ? originSuggestions : destSuggestions;
    const activeIndex = field === "origin" ? activeOriginIndex : activeDestIndex;
    const setActive = field === "origin" ? setActiveOriginIndex : setActiveDestIndex;
    const setShow = field === "origin" ? setShowOriginDropdown : setShowDestDropdown;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setShow(true);
      setActive((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setShow(true);
      setActive((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === "Enter" && activeIndex >= 0 && suggestions[activeIndex]) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex], field);
    } else if (e.key === "Escape") {
      setShow(false);
      setActive(-1);
      e.currentTarget.blur();
    }
  };

  const handleFocus = (field: "origin" | "destination") => {
    const value = field === "origin" ? originDisplay : destinationDisplay;
    if (value.trim().length >= 2) {
      if (field === "origin") setShowOriginDropdown(true);
      else setShowDestDropdown(true);
    }
  };

  const handleBlur = (field: "origin" | "destination") => {
    setTimeout(() => {
      if (field === "origin") setShowOriginDropdown(false);
      else setShowDestDropdown(false);
    }, 180);
  };

  const selectSuggestion = (suggestion: Suggestion, field: "origin" | "destination") => {
    if (field === "origin") {
      setOriginCode(suggestion.code);
      setOriginDisplay(suggestion.display);
      setOriginSuggestions([]);
      setShowOriginDropdown(false);
      setActiveOriginIndex(-1);
      setOriginError("");
      // Auto-focus destination (Google Flights style)
      setTimeout(() => destInputRef.current?.focus(), 50);
    } else {
      setDestinationCode(suggestion.code);
      setDestinationDisplay(suggestion.display);
      setDestSuggestions([]);
      setShowDestDropdown(false);
      setActiveDestIndex(-1);
      setDestinationError("");
    }
  };

  // ── Form submission ──────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;

    if (!originCode || !/^[A-Z]{3}$/.test(originCode)) {
      setOriginError("Please select a valid airport or city");
      valid = false;
    } else {
      setOriginError("");
    }

    if (!destinationCode || !/^[A-Z]{3}$/.test(destinationCode)) {
      setDestinationError("Please select a valid airport or city");
      valid = false;
    } else if (destinationCode === originCode) {
      setDestinationError("Origin and destination cannot be the same");
      valid = false;
    } else {
      setDestinationError("");
    }

    if (!departureDate) {
      setDepartureError("Departure date is required");
      valid = false;
    } else {
      setDepartureError("");
    }

    if (returnDate && departureDate && returnDate < departureDate) {
      setReturnError("Return date cannot be before departure");
      valid = false;
    } else {
      setReturnError("");
    }

    if (!valid) return;

    setIsLoading(true);
    setApiError("");

    try {
      await onSearch({
        origin: originCode,
        destination: destinationCode,
        departureDate,
        returnDate: returnDate || undefined,
        adults,
        children,
        cabin,
        direct,
      });

      resultsRef?.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      if (err instanceof AxiosError) {
        setApiError(
          err.response?.data?.message || "Failed to fetch flights. Please try again."
        );
      } else if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit}
      className="backdrop-blur-lg bg-white/20 border border-white/20 rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 flex flex-col gap-6 max-w-6xl mx-auto transition-all duration-500 hover:shadow-3xl"
    >
      {apiError && (
        <p className="text-red-600 font-semibold text-center text-base sm:text-lg bg-red-50/70 py-2.5 rounded-xl">
          {apiError}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {/* Origin */}
        <div className="flex flex-col relative" ref={originRef}>
          <label htmlFor="origin-input" className="text-gray-900 text-base sm:text-lg mb-1 font-medium">
            From
          </label>
          <input
            ref={originInputRef}
            id="origin-input"
            type="text"
            value={originDisplay}
            onChange={(e) => handleInputChange(e, "origin")}
            onFocus={() => handleFocus("origin")}
            onBlur={() => handleBlur("origin")}
            onKeyDown={(e) => handleKeyDown(e, "origin")}
            placeholder="PARIS (PAR)"
            disabled={isLoading}
            autoComplete="off"
            role="combobox"
            aria-expanded={showOriginDropdown}
            aria-controls="origin-listbox"
            aria-autocomplete="list"
            aria-invalid={!!originError}
            className={`p-3.5 sm:p-4 border-2 rounded-xl focus:outline-none focus:ring-2 bg-white/40 text-black placeholder-gray-200 transition text-base cursor-${
              isLoading ? "not-allowed" : "text"
            } ${originError ? "border-red-400  focus:ring-red-300" : "border-white/40 focus:ring-gray-600"}`}
          />
          {originError && (
            <p className="text-red-400 text-xs absolute top-full left-0 ">
              {originError}
            </p>
          )}

          {showOriginDropdown && (
            <ul
              id="origin-listbox"
              role="listbox"
              className="absolute z-50 top-full left-0 right-0 mt-1 bg-white/95 border border-gray-300 rounded-xl shadow-xl max-h-60 overflow-auto"
            >
              {originSuggestions.length > 0 ? (
                originSuggestions.map((sugg, idx) => (
                  <li
                    key={sugg.code}
                    role="option"
                    aria-selected={idx === activeOriginIndex}
                    onMouseDown={() => selectSuggestion(sugg, "origin")}
                    className={`px-4 py-2.5 hover:bg-amber-50 cursor-pointer text-sm text-gray-800 flex flex-col ${
                      idx === activeOriginIndex ? "bg-amber-100" : ""
                    }`}
                  >
                    <span className="font-medium">{sugg.label}</span>
                    {sugg.subLabel && (
                      <span className="text-xs text-gray-600">{sugg.subLabel}</span>
                    )}
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-gray-500 text-sm italic text-center">
                  No matching locations
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Destination */}
        <div className="flex flex-col relative" ref={destRef}>
          <label htmlFor="destination-input" className="text-gray-900 text-base sm:text-lg mb-1 font-medium">
            To
          </label>
          <input
            ref={destInputRef}
            id="destination-input"
            type="text"
            value={destinationDisplay}
            onChange={(e) => handleInputChange(e, "destination")}
            onFocus={() => handleFocus("destination")}
            onBlur={() => handleBlur("destination")}
            onKeyDown={(e) => handleKeyDown(e, "destination")}
            placeholder="MADRID (MAD)"
            disabled={isLoading}
            autoComplete="off"
            role="combobox"
            aria-expanded={showDestDropdown}
            aria-controls="dest-listbox"
            aria-autocomplete="list"
            aria-invalid={!!destinationError}
            className={`p-3.5 sm:p-4 border-2 rounded-xl focus:outline-none focus:ring-2 bg-white/40 text-black placeholder-gray-200 transition text-base cursor-${
              isLoading ? "not-allowed" : "text"
            } ${destinationError ? "border-red-400 focus:ring-red-300" : "border-white/40 focus:ring-gray-600"}`}
          />
          {destinationError && (
            <p className="text-red-400 text-xs absolute top-full left-0 ">
              {destinationError}
            </p>
          )}

          {showDestDropdown && (
            <ul
              id="dest-listbox"
              role="listbox"
              className="absolute z-50 top-full left-0 right-0 mt-1 bg-white/95 border border-gray-300 rounded-xl shadow-xl max-h-60 overflow-auto"
            >
              {destSuggestions.length > 0 ? (
                destSuggestions.map((sugg, idx) => (
                  <li
                    key={sugg.code}
                    role="option"
                    aria-selected={idx === activeDestIndex}
                    onMouseDown={() => selectSuggestion(sugg, "destination")}
                    className={`px-4 py-2.5 hover:bg-amber-50 cursor-pointer text-sm text-gray-800 flex flex-col ${
                      idx === activeDestIndex ? "bg-amber-100" : ""
                    }`}
                  >
                    <span className="font-medium">{sugg.label}</span>
                    {sugg.subLabel && (
                      <span className="text-xs text-gray-600">{sugg.subLabel}</span>
                    )}
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-gray-500 text-sm italic text-center">
                  No matching locations
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Departure */}
        <div className="flex flex-col relative">
          <label htmlFor="departure-date" className="text-gray-900 text-base sm:text-lg mb-1 font-medium">
            Departure
          </label>
          <input
            id="departure-date"
            type="date"
            value={departureDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDepartureDate(e.target.value)}
            disabled={isLoading}
            className={`p-3.5 sm:p-3 border rounded-xl focus:outline-none focus:ring-2 bg-white/40 text-black transition text-base ${
              departureError ? "border-red-400 focus:ring-red-300" : "border-white/40 focus:ring-gray-600"
            }`}
          />
          {departureError && (
            <p className="text-red-400 text-xs mt-1 absolute top-full left-0">
              {departureError}
            </p>
          )}
        </div>

        {/* Return */}
        <div className="flex flex-col relative">
          <label htmlFor="return-date" className="text-gray-900 text-base sm:text-lg mb-1 font-medium">
            Return
          </label>
          <input
            id="return-date"
            type="date"
            value={returnDate}
            min={departureDate || new Date().toISOString().split("T")[0]}
            onChange={(e) => setReturnDate(e.target.value)}
            disabled={isLoading}
            className={`p-3.5 sm:p-3 border rounded-xl focus:outline-none focus:ring-2 bg-white/40 text-black transition text-base ${
              returnError ? "border-red-400 focus:ring-red-300" : "border-white/40 focus:ring-gray-600"
            }`}
          />
          {returnError && (
            <p className="text-red-400 text-xs mt-1 absolute top-full left-0">
              {returnError}
            </p>
          )}
        </div>

        {/* Adults */}
        <div className="flex flex-col">
          <label htmlFor="adults-input" className="text-gray-900 text-base sm:text-lg mb-1 font-medium">
            Adults
          </label>
          <input
            id="adults-input"
            type="number"
            min={1}
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            disabled={isLoading}
            className="p-3.5 sm:p-3 border rounded-xl focus:outline-none focus:ring-2 bg-white/40 text-black border-white/40 focus:ring-gray-600 transition text-base"
          />
        </div>

        {/* Children */}
        <div className="flex flex-col">
          <label htmlFor="children-input" className="text-gray-900 text-base sm:text-lg mb-1 font-medium">
            Children
          </label>
          <input
            id="children-input"
            type="number"
            min={0}
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
            disabled={isLoading}
            className="p-3.5 sm:p-3 border rounded-xl focus:outline-none focus:ring-2 bg-white/40 text-black border-white/40 focus:ring-gray-600 transition text-base"
          />
        </div>

        {/* Cabin */}
        <div className="flex flex-col">
          <label htmlFor="cabin-select" className="text-gray-900 text-base sm:text-lg mb-1 font-medium">
            Cabin
          </label>
          <select
            id="cabin-select"
            value={cabin}
            onChange={(e) => setCabin(e.target.value)}
            disabled={isLoading}
            className="p-3.5 sm:p-3 border rounded-xl focus:outline-none focus:ring-2 bg-white/40 text-black border-white/40 focus:ring-gray-600 transition text-base"
          >
            <option value="ECONOMY">Economy</option>
            <option value="PREMIUM_ECONOMY">Premium Economy</option>
            <option value="BUSINESS">Business</option>
            <option value="FIRST">First</option>
          </select>
        </div>

        {/* Direct flights only */}
        <div className="flex items-center gap-2.5 sm:col-span-2 lg:col-span-1 lg:mt-9">
          <input
            type="checkbox"
            id="direct"
            checked={direct}
            onChange={(e) => setDirect(e.target.checked)}
            disabled={isLoading}
            className="w-5 h-5 accent-amber-500"
          />
          <label htmlFor="direct" className="text-gray-900 text-base sm:text-lg font-medium cursor-pointer select-none">
            Direct flights only
          </label>
        </div>
      </div>

      {/* Submit button */}
      <div className="mt-2 sm:mt-4 flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className={`bg-linear-to-r from-amber-700 via-amber-600 to-amber-500 text-black font-bold py-3.5 px-10 rounded-2xl shadow-lg hover:scale-105 transform transition-all duration-300 w-full sm:w-auto min-h-13 text-lg flex items-center justify-center gap-2 ${
            isLoading ? "opacity-80 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <>
              <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full" />
              Searching...
            </>
          ) : (
            "Search Flights"
          )}
        </button>
      </div>
    </form>
  );
}