import type { TooltipProps } from "recharts";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Area,
} from "recharts";
import type { FlightOffer } from "../../types/flight.types";

/* ===== Types ===== */

export interface PriceChartData {
  name: string;
  price: number;
  flight?: FlightOffer;
}

interface TooltipPayloadData extends PriceChartData {
  x: number;
}

interface PriceChartProps {
  filteredFlights: FlightOffer[];
  priceData: PriceChartData[];
}

/* ===== Custom Tooltip ===== */

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<number, string> & { payload?: { payload: TooltipPayloadData }[] }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const { price, name, flight } = data;

  return (
    <div className="rounded-xl border border-amber-700/30 bg-slate-900/95 backdrop-blur-lg px-4 py-3 shadow-2xl shadow-black/60">
      <p className="font-medium text-amber-300">{name}</p>
      <p className="mt-1.5 text-lg font-semibold text-white">
        €{price.toLocaleString()}
      </p>

      {flight && (
        <div className="mt-2 text-xs text-slate-400 space-y-0.5">
          {flight.itineraries.map((itinerary, idx) => (
            <div key={idx}>
              {itinerary.segments.map((segment) => (
                <p key={segment.id}>
                  {segment.departure.iataCode} → {segment.arrival.iataCode} ({segment.aircraft.code})
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ===== Main Component ===== */

export default function PriceChart({
  filteredFlights,
  priceData,
}: PriceChartProps) {
  const chartData: TooltipPayloadData[] = priceData.map((item, index) => ({
    ...item,
    x: index,
  }));

  const prices = chartData.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-slate-950/80 to-slate-900/60 backdrop-blur-xl shadow-2xl shadow-black/50 ring-1 ring-amber-700/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 px-6 py-5 sm:px-8">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Price Trends
          </h2>
          <p className="mt-1.5 text-sm text-slate-400">
            {filteredFlights.length} routes • sorted by price (cheapest → highest)
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center gap-5 text-sm">
          <div>
            <span className="text-green-400 font-medium">€{minPrice.toLocaleString()}</span>
            <span className="ml-1.5 text-slate-500">min</span>
          </div>
          <div>
            <span className="text-amber-300 font-medium">€{Math.round(avgPrice).toLocaleString()}</span>
            <span className="ml-1.5 text-slate-500">avg</span>
          </div>
          <div>
            <span className="text-red-400 font-medium">€{maxPrice.toLocaleString()}</span>
            <span className="ml-1.5 text-slate-500">max</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5 sm:p-6 lg:p-8">
        <ResponsiveContainer width="100%" height={380}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 30 }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>

              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#d97706" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 5" stroke="rgba(255,255,255,0.06)" vertical={false} />

            <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} hide />

            <YAxis
              tickFormatter={(v) => `€${v.toLocaleString()}`}
              axisLine={false}
              tickLine={false}
              width={60}
              domain={[minPrice - 50, maxPrice + 50]}
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 400 }}
            />

            <Area type="monotone" dataKey="price" fill="url(#areaGradient)" fillOpacity={1} stroke="none" isAnimationActive={false} />

            <Line
              type="monotone"
              dataKey="price"
              stroke="url(#priceGradient)"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 10,
                fill: "#020617",
                stroke: "#fbbf24",
                strokeWidth: 4,
                filter: "drop-shadow(0 0 8px rgba(251,191,36,0.6))",
              }}
              isAnimationActive={false}
            />

            <ReferenceLine y={minPrice} stroke="#22c55e" strokeDasharray="5 5" label={{ value: "Min", position: "right", fill: "#86efac", fontSize: 12 }} />
            <ReferenceLine y={Math.round(avgPrice)} stroke="#fbbf24" strokeDasharray="5 5" label={{ value: "Avg", position: "right", fill: "#fcd34d", fontSize: 12 }} />
            <ReferenceLine y={maxPrice} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "Max", position: "right", fill: "#f87171", fontSize: 12 }} />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#fbbf24", strokeWidth: 2, strokeDasharray: "4 4" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
