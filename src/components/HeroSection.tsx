export default function HeroSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-20 sm:pt-24 lg:pt-28 pb-16 px-5 sm:px-8 bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/20 " />
      <div className="relative z-10 w-full max-w-5xl text-center text-white">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-2xl">
          {" "}
          <span className="bg-linear-to-r from-yellow-400 via-amber-300 to-orange-500 bg-clip-text text-transparent tracking-wide ">
            Find Your Perfect Flight
          </span>
        </h1>
        <p className="mt-5 text-lg sm:text-2xl text-white/80 max-w-3xl mx-auto">
          Compare real-time prices and book your next adventure
        </p>

        <div className="mt-10 sm:mt-14 mx-auto max-w-4xl">
          <div className="backdrop-blur-2xl bg-white/12 border border-white/20 rounded-3xl shadow-2xl shadow-black/40 p-6 sm:p-8 lg:p-10 ring-1 ring-amber-600/30">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
