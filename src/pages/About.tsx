// src/pages/About.jsx  (or wherever your pages live)
import { Link } from 'react-router-dom'; // ← for navigation back to home
import Navbar from '../components/Navbar'; // adjust path as needed
import { Plane, Search, Filter, BarChart3, ShieldCheck, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-gray-950 text-white">
      <Navbar />

      {/* Hero-like section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.08),transparent_40%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              About <span className="text-amber-400">FlightFinder</span>
            </h1>
            <p className="mt-6 text-xl text-slate-300 leading-relaxed">
              We help travelers find the best flight deals quickly and transparently — no hidden fees, no nonsense.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left column - Story & Mission */}
          <div className="space-y-10">
            <div className="backdrop-blur-2xl bg-white/8 border border-white/12 rounded-3xl shadow-2xl shadow-black/40 p-8 lg:p-10 ring-1 ring-amber-600/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-600/20 flex items-center justify-center">
                  <Plane className="w-7 h-7 text-amber-400" />
                </div>
                <h2 className="text-3xl font-bold">Our Mission</h2>
              </div>
              <p className="text-lg text-slate-300 leading-relaxed">
                FlightFinder was created to make flight searching simple, fast, and fair. 
                We believe you shouldn't need to open 10 tabs or install shady extensions 
                to find a good deal.
              </p>
              <p className="mt-5 text-lg text-slate-300 leading-relaxed">
                We aggregate real-time data from trusted sources and present it in a clean, 
                understandable way — so you can focus on planning your trip, not on comparing websites.
              </p>
            </div>

            <div className="backdrop-blur-2xl bg-white/8 border border-white/12 rounded-3xl shadow-2xl shadow-black/40 p-8 lg:p-10 ring-1 ring-amber-600/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-600/20 flex items-center justify-center">
                  <Globe className="w-7 h-7 text-amber-400" />
                </div>
                <h2 className="text-3xl font-bold">What We Offer</h2>
              </div>

              <ul className="space-y-5 text-slate-200">
                <li className="flex items-start gap-4">
                  <Search className="w-6 h-6 text-amber-400 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-white">Smart Search</p>
                    <p className="text-slate-400">Flexible dates, multi-city, cabin class filtering</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Filter className="w-6 h-6 text-amber-400 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-white">Powerful Filters</p>
                    <p className="text-slate-400">Price, stops, airlines, departure/arrival time, direct only</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <BarChart3 className="w-6 h-6 text-amber-400 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-white">Price Trends</p>
                    <p className="text-slate-400">Visual chart showing cheapest → most expensive options</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 text-amber-400 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-white">Transparent Pricing</p>
                    <p className="text-slate-400">Total price shown — no surprise taxes at checkout</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right column - Stats + Visuals */}
          <div className="space-y-10">
            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-6">
              <div className="backdrop-blur-2xl bg-white/8 border border-white/12 rounded-3xl shadow-2xl shadow-black/40 p-8 text-center ring-1 ring-amber-600/10">
                <p className="text-4xl md:text-5xl font-bold text-amber-400">50k+</p>
                <p className="mt-3 text-slate-300">Searches monthly</p>
              </div>

              <div className="backdrop-blur-2xl bg-white/8 border border-white/12 rounded-3xl shadow-2xl shadow-black/40 p-8 text-center ring-1 ring-amber-600/10">
                <p className="text-4xl md:text-5xl font-bold text-amber-400">120+</p>
                <p className="mt-3 text-slate-300">Airlines tracked</p>
              </div>

              <div className="backdrop-blur-2xl bg-white/8 border border-white/12 rounded-3xl shadow-2xl shadow-black/40 p-8 text-center ring-1 ring-amber-600/10">
                <p className="text-4xl md:text-5xl font-bold text-amber-400">98%</p>
                <p className="mt-3 text-slate-300">Price accuracy</p>
              </div>

              <div className="backdrop-blur-2xl bg-white/8 border border-white/12 rounded-3xl shadow-2xl shadow-black/40 p-8 text-center ring-1 ring-amber-600/10">
                <p className="text-4xl md:text-5xl font-bold text-amber-400">24/7</p>
                <p className="mt-3 text-slate-300">Real-time updates</p>
              </div>
            </div>

            {/* Visual / mood images area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/50 aspect-4/3 group">
                <img
                  src="/about-1.jpg"
                  alt="Airplane wing view at sunset"
                  className="absolute inset-0 w-full h-full object-cover "
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-lg font-medium">
                  Explore the world
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/50 aspect-4/3 group">
                <img
                  src="/about-2.jpg"
                  alt="Tropical beach destination"
                  className="absolute inset-0 w-full h-full object-cover "
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-lg font-medium">
                  Your next adventure
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/50 aspect-4/3 group sm:col-span-2 lg:col-span-1">
                <img
                  src="/about-3.jpg"
                  alt="City skyline at night with airport lights"
                  className="absolute inset-0 w-full h-full object-cover "
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-lg font-medium">
                  Cities waiting for you
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA footer section */}
      <section className="border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to find your next flight?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Start searching now — it's free, fast, and updated in real time.
          </p>
          <Link
            to="/" // ← React Router navigation
            className="inline-flex items-center gap-3 px-8 py-4 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-semibold text-lg rounded-2xl shadow-xl shadow-amber-900/30 transition-all duration-200 transform hover:scale-[1.02]"
          >
            <Plane className="w-6 h-6" />
            Search Flights Now
          </Link>
        </div>
      </section>
    </div>
  );
}