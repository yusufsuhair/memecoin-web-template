"use client";

const Hero = () => {
  return (
    <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      <div className="w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Text Content */}
        <div className="text-center lg:text-left space-y-8 lg:space-y-12">
          {/* Logo/Title */}
          <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white">
            UFO
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold text-white leading-none">
            $UFO
          </h1>

          {/* Tagline */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            The most memeable memecoin in existence. The dogs have had their day, it's time for UFO to take reign.
          </p>

          {/* Token Address Link */}
          <div className="flex justify-center lg:justify-start">
            <a
              href="https://pump.fun/[TOKEN_ADDRESS]"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:opacity-90 transition-opacity text-lg"
            >
              View on Pump.fun
            </a>
          </div>
        </div>

        {/* Right Side - Mascot Image */}
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl aspect-square bg-[url('/pepe-coin.png')] bg-cover bg-center bg-no-repeat rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
