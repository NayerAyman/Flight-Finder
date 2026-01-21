import { useMemo, useState ,useRef } from "react";
import Navbar from "../components/Navbar";
import SearchForm, { type SearchParams } from "../components/search/SearchForm";
import FlightList from "../components/flights/FlightList";
import FilterPanel from "../components/filters/FiltersPanel";
import useFlights from "../hooks/useFlights";
import { useQueryParams } from "../hooks/useQueryParams";
import { useFilteredFlights } from "../hooks/useFilteredFlights";

import HeroSection from "../components/HeroSection";
import PriceChart from "../components/charts/PriceChart";

export default function Home() {
  const { flights, fetchFlights, loading } = useFlights();
  const { get, getArray, set } = useQueryParams();
  const resultsRef = useRef<HTMLDivElement | null>(null);

  // URL-synced states
  const maxPriceFromUrl = Number(get("maxPrice", "1000"));
  const stopsFromUrl = get("stops", "any") as "any" | "0" | "1" | "2";
  const airlinesFromUrl = getArray("airlines");
  const cabinsFromUrl = getArray("cabins");
  const directFromUrl = get("direct", "false") === "true";

  const [maxPrice, setMaxPrice] = useState(maxPriceFromUrl);
  const [stops, setStops] = useState(stopsFromUrl);
  const [selectedAirlines, setSelectedAirlines] = useState(airlinesFromUrl);
  const [selectedCabins, setSelectedCabins] = useState(cabinsFromUrl);
  const [departureTimeRange, setDepartureTimeRange] = useState<
    [number, number]
  >([0, 23]);
  const [arrivalTimeRange, setArrivalTimeRange] = useState<[number, number]>([
    0, 23,
  ]);
  const [directOnly, setDirectOnly] = useState(directFromUrl);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredFlights = useFilteredFlights(flights, {
    maxPrice,
    stops,
    selectedAirlines,
    selectedCabins,
    departureTimeRange,
    arrivalTimeRange,
    directOnly,
  });

  const priceData = useMemo(
    () =>
      filteredFlights
        .map((f) => {
          const first = f.itineraries?.[0]?.segments?.[0];
          const last = f.itineraries?.[0]?.segments?.slice(-1)[0];
          const route =
            first && last
              ? `${first.departure.iataCode} → ${last.arrival.iataCode}`
              : "Unknown";
          return { name: route, price: Number(f.price.total) };
        })
        .sort((a, b) => a.price - b.price),
    [filteredFlights],
  );

  const handleSearch = async (params: SearchParams) =>
    await fetchFlights(params);

  const handleStopsChange = (v: string) => {
    const typed = v as "any" | "0" | "1" | "2";
    setStops(typed);
    set("stops", typed);
  };

  const handleMaxPriceChange = (v: number) => {
    setMaxPrice(v);
    set("maxPrice", v.toString());
  };

  const handleAirlinesChange = (arr: string[]) => {
    setSelectedAirlines(arr);
    set("airlines", arr);
  };

  const handleCabinsChange = (arr: string[]) => {
    setSelectedCabins(arr);
    set("cabins", arr);
  };

  const handleDirectChange = (v: boolean) => {
    setDirectOnly(v);
    set("direct", v.toString());
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-gray-950">
      <Navbar />

      {/* Hero Section */}
      <HeroSection>
        <SearchForm  resultsRef={resultsRef} onSearch={handleSearch} />
      </HeroSection>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16" ref={resultsRef}>
        <div className="flex flex-col lg:flex-row lg:gap-10">
          {/* Desktop Filters */}
          <aside className="hidden lg:block lg:w-80 xl:w-96 shrink-0">
            <div className="sticky top-24 backdrop-blur-2xl bg-white/10 border border-white/15 rounded-3xl shadow-2xl shadow-black/30 p-7 ring-1 ring-amber-600/20">
              <h2 className="text-2xl font-bold text-white mb-7">Filters</h2>
              <FilterPanel
                flights={flights}
                maxPrice={maxPrice}
                stops={stops}
                selectedAirlines={selectedAirlines}
                selectedCabins={selectedCabins}
                departureTimeRange={departureTimeRange}
                arrivalTimeRange={arrivalTimeRange}
                directOnly={directOnly}
                onMaxPriceChange={handleMaxPriceChange}
                onStopsChange={handleStopsChange}
                onAirlinesChange={handleAirlinesChange}
                onCabinsChange={handleCabinsChange}
                onDirectOnlyChange={handleDirectChange}
                onDepartureTimeChange={setDepartureTimeRange}
                onArrivalTimeChange={setArrivalTimeRange}
              />
            </div>
          </aside>

          <main className="flex-1 space-y-12">
            {/* Mobile Filters Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-amber-600 text-white shadow-xl shadow-amber-900/40 flex items-center justify-center text-sm font-semibold hover:bg-amber-500 active:scale-95 transition-all duration-200"
              aria-label="Open filters"
            >
              Filters
            </button>

            {/* Mobile Filters Modal */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 bg-black/65 flex items-end lg:hidden">
                <div className="w-full max-h-[88vh] rounded-t-3xl overflow-hidden backdrop-blur-2xl bg-white/10 border-t border-white/20 shadow-2xl shadow-black/50 animate-slide-up">
                  <div className="sticky top-0 backdrop-blur-xl bg-black/40 border-b border-white/15 px-6 py-5 flex items-center justify-between z-10">
                    <h2 className="text-xl font-semibold text-white">
                      Filters
                    </h2>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="text-white/90 hover:text-white text-3xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="p-6 sm:p-8">
                    <FilterPanel
                      flights={flights}
                      maxPrice={maxPrice}
                      stops={stops}
                      selectedAirlines={selectedAirlines}
                      selectedCabins={selectedCabins}
                      departureTimeRange={departureTimeRange}
                      arrivalTimeRange={arrivalTimeRange}
                      directOnly={directOnly}
                      onMaxPriceChange={handleMaxPriceChange}
                      onStopsChange={handleStopsChange}
                      onAirlinesChange={handleAirlinesChange}
                      onCabinsChange={handleCabinsChange}
                      onDirectOnlyChange={handleDirectChange}
                      onDepartureTimeChange={setDepartureTimeRange}
                      onArrivalTimeChange={setArrivalTimeRange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Price Chart */}
            {filteredFlights.length > 0 && (
              <PriceChart filteredFlights={filteredFlights} priceData={priceData} />
            )}

            {/* Flight List / States */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 text-white/80">
                <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <p className="mt-6 text-xl font-medium">Searching flights...</p>
              </div>
            ) : filteredFlights.length === 0 ? (
              <div className="backdrop-blur-2xl bg-white/10 border border-white/15 rounded-3xl shadow-2xl shadow-black/30 p-12 text-center">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  No flights found
                </h3>
                <p className="text-white/70 max-w-md mx-auto text-lg">
                  Try different dates, destinations or fewer filters.
                </p>
              </div>
            ) : (
              <FlightList flights={filteredFlights} />
            )}
          </main>
        </div>
      </section>
    </div>
  );
}
