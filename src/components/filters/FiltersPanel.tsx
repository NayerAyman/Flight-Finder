import React, { useState } from "react";
import type { FlightOffer } from "../../types/flight.types";

interface Props {
  maxPrice: number;
  stops: string;
  flights: FlightOffer[];
  selectedAirlines: string[];
  selectedCabins: string[];
  departureTimeRange: [number, number];
  arrivalTimeRange: [number, number];
  directOnly: boolean;
  onMaxPriceChange: (value: number) => void;
  onStopsChange: (value: string) => void;
  onAirlinesChange: (airlines: string[]) => void;
  onCabinsChange: (cabins: string[]) => void;
  onDepartureTimeChange: (range: [number, number]) => void;
  onArrivalTimeChange: (range: [number, number]) => void;
  onDirectOnlyChange: (value: boolean) => void;
}

const FilterPanel: React.FC<Props> = ({
  maxPrice,
  stops,
  flights,
  selectedAirlines,
  selectedCabins,
  departureTimeRange,
  arrivalTimeRange,
  directOnly,
  onMaxPriceChange,
  onStopsChange,
  onAirlinesChange,
  onCabinsChange,
  onDepartureTimeChange,
  onArrivalTimeChange,
  onDirectOnlyChange,
}) => {
  // ✅ Extract unique airlines safely
  const airlines = Array.from(
    new Set(
      flights
        .map(f => f.itineraries?.[0]?.segments?.[0]?.carrierCode?.trim() || "Unknown")
        .filter(Boolean)
    )
  ).sort();

  // ✅ Extract unique cabin classes safely
  const cabins = Array.from(
    new Set(
      flights
        .map(f => f.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin?.trim())
        .filter(Boolean)
    )
  ).sort();

  const [showAllAirlines, setShowAllAirlines] = useState(false);

  const visibleAirlines = showAllAirlines ? airlines : airlines.slice(0, 7);

  const toggleAirline = (airline: string) =>
    selectedAirlines.includes(airline)
      ? onAirlinesChange(selectedAirlines.filter(a => a !== airline))
      : onAirlinesChange([...selectedAirlines, airline]);

  const toggleCabin = (cabin: string) =>
    selectedCabins.includes(cabin)
      ? onCabinsChange(selectedCabins.filter(c => c !== cabin))
      : onCabinsChange([...selectedCabins, cabin]);

  const handleTimeChange = (
    type: "departure" | "arrival",
    index: 0 | 1,
    value: string
  ) => {
    const num = Number(value);
    if (isNaN(num) || num < 0 || num > 23) return;

    const range = type === "departure" ? departureTimeRange : arrivalTimeRange;
    const setter = type === "departure" ? onDepartureTimeChange : onArrivalTimeChange;

    const newRange: [number, number] = [...range];
    newRange[index] = num;
    setter(newRange);
  };

  return (
    <div
      className="
        backdrop-blur-2xl bg-white/10 border border-white/15
        rounded-2xl shadow-xl shadow-black/25 ring-1 ring-amber-600/15
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="px-5 py-2.5 border-b border-white/10">
        <h2 className="text-base font-semibold text-white">Filters</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Max Price */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-white/85">Max Price (€)</label>
          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={maxPrice}
            onChange={e => onMaxPriceChange(Number(e.target.value))}
            className="
              w-full h-1 bg-white/15 rounded-full cursor-pointer
              [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600
              [&::-webkit-slider-thumb]:shadow-sm
            "
          />
          <div className="text-right text-xs text-amber-400 font-medium">
            {maxPrice} €
          </div>
        </div>

        {/* Stops */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-white/85">Stops</label>
          <select
            value={stops}
            onChange={e => onStopsChange(e.target.value)}
            className="
              w-full bg-white/5 border border-white/20 text-black text-xs
              rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500/40
            "
          >
            <option value="any">Any</option>
            <option value="0">Non-stop</option>
            <option value="1">1 stop</option>
            <option value="2">2+</option>
          </select>
        </div>

        {/* Airlines */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-white/85">Airlines</label>
          <div className="flex flex-wrap gap-1.5">
            {visibleAirlines.map(airline => (
              <label
                key={airline}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full
                  bg-white/5 border border-white/15 cursor-pointer
                  hover:bg-white/10 transition-colors
                  ${selectedAirlines.includes(airline) ? "bg-amber-900/40 border-amber-600/50" : ""}
                `}
              >
                <input
                  type="checkbox"
                  checked={selectedAirlines.includes(airline)}
                  onChange={() => toggleAirline(airline)}
                  className="w-3.5 h-3.5 rounded bg-white/5 border-white/30 text-amber-500 focus:ring-0"
                />
                <span className="truncate max-w-27.5">{airline}</span>
              </label>
            ))}
          </div>

          {airlines.length > 7 && (
            <button
              onClick={() => setShowAllAirlines(!showAllAirlines)}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium mt-1.5 transition-colors"
            >
              {showAllAirlines ? "Show less" : `+${airlines.length - 7} more`}
            </button>
          )}

          {airlines.length === 0 && (
            <span className="text-xs text-white/40">No airlines available</span>
          )}
        </div>

        {/* Cabins */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-white/85">Cabin</label>
          <div className="flex flex-wrap gap-1.5">
            {cabins.map(cabin => (
              <label
                key={cabin}
                className={`
                  flex items-center gap-1.5 px-3 py-1 text-xs rounded-full
                  bg-white/5 border border-white/15 cursor-pointer
                  hover:bg-white/10 transition-colors
                  ${selectedCabins.includes(cabin) ? "bg-amber-900/40 border-amber-600/50" : ""}
                `}
              >
                <input
                  type="checkbox"
                  checked={selectedCabins.includes(cabin)}
                  onChange={() => toggleCabin(cabin)}
                  className="w-3.5 h-3.5 rounded bg-white/5 border-white/30 text-amber-500 focus:ring-0"
                />
                <span className="capitalize">{cabin.toLowerCase()}</span>
              </label>
            ))}
            {cabins.length === 0 && (
              <span className="text-xs text-white/40">No cabins available</span>
            )}
          </div>
        </div>

        {/* Time Ranges */}
        <div className="grid grid-cols-2 gap-4">
          {/* Departure */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-white/80">Dep.</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={0}
                max={23}
                value={departureTimeRange[0]}
                onChange={e => handleTimeChange("departure", 0, e.target.value)}
                className="w-full text-center bg-white/5 border border-white/20 rounded-lg py-1 text-xs text-white focus:ring-1 focus:ring-amber-500/40"
              />
              <span className="text-white/30 text-xs">–</span>
              <input
                type="number"
                min={0}
                max={23}
                value={departureTimeRange[1]}
                onChange={e => handleTimeChange("departure", 1, e.target.value)}
                className="w-full text-center bg-white/5 border border-white/20 rounded-lg py-1 text-xs text-white focus:ring-1 focus:ring-amber-500/40"
              />
            </div>
          </div>

          {/* Arrival */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-white/80">Arr.</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={0}
                max={23}
                value={arrivalTimeRange[0]}
                onChange={e => handleTimeChange("arrival", 0, e.target.value)}
                className="w-full text-center bg-white/5 border border-white/20 rounded-lg py-1 text-xs text-white focus:ring-1 focus:ring-amber-500/40"
              />
              <span className="text-white/30 text-xs">–</span>
              <input
                type="number"
                min={0}
                max={23}
                value={arrivalTimeRange[1]}
                onChange={e => handleTimeChange("arrival", 1, e.target.value)}
                className="w-full text-center bg-white/5 border border-white/20 rounded-lg py-1 text-xs text-white focus:ring-1 focus:ring-amber-500/40"
              />
            </div>
          </div>
        </div>

        {/* Direct only */}
        <label className="flex items-center gap-2 text-xs text-white/90 cursor-pointer hover:text-white pt-1">
          <input
            type="checkbox"
            checked={directOnly}
            onChange={e => onDirectOnlyChange(e.target.checked)}
            className="w-4 h-4 rounded bg-white/5 border-white/30 text-amber-500 focus:ring-0"
          />
          <span>Direct only</span>
        </label>
      </div>
    </div>
  );
};

export default FilterPanel;
