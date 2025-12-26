"use client";

const Tokenomics = () => {
  const totalSupply = "420,690,000,000,000";

  const features = [
    {
      title: "Zero Taxes",
      description: "No buy or sell taxes. Trade freely.",
    },
    {
      title: "LP Burnt",
      description: "Liquidity pool tokens permanently locked.",
    },
    {
      title: "Contract Renounced",
      description: "Fully decentralized. No rug pulls possible.",
    },
    {
      title: "Fair Launch",
      description: "No presale, no team allocation. Pure meme.",
    },
  ];

  return (
    <section id="tokenomics" className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-20 text-center text-white">
          TOKENOMICS
        </h2>

        {/* Token Supply Section */}
        <div className="mb-20 text-center">
          <p className="text-xl sm:text-2xl text-white/70 mb-6 uppercase tracking-wider">
            Total Supply
          </p>
          <div className="inline-block px-8 py-6 rounded-lg bg-white/5 backdrop-blur-sm">
            <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
              {totalSupply}
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-lg p-6 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Main Message */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="py-8">
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              No Taxes, No Bullshit.
            </p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/60">
              It's that simple.
            </p>
          </div>
          <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
            LP tokens are burnt, and contract ownership is renounced. This is a community-driven token with zero dev control.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;
