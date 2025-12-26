"use client";

const HowToBuy = () => {
  const steps = [
    {
      title: "Create a Wallet",
      description: "Download metamask or your wallet of choice from the app store or google play store for free. Desktop users, download the google chrome extension by going to metamask.io.",
    },
    {
      title: "Get Some ETH",
      description: "Have ETH in your wallet to switch to $MEME. If you don't have any ETH, you can buy directly on metamask, transfer from another wallet, or buy on another exchange and send it to your wallet.",
    },
    {
      title: "Go to Uniswap",
      description: "Connect to Uniswap. Go to app.uniswap.org in google chrome or on the browser inside your Metamask app. Connect your wallet. Paste the $MEME token address into Uniswap, select MEME, and confirm. When Metamask prompts you for a wallet signature, sign.",
    },
    {
      title: "Switch ETH for $MEME",
      description: "Switch ETH for $MEME. We have ZERO taxes so you don't need to worry about buying with a specific slippage, although you may need to use slippage during times of market volatility.",
    },
  ];

  return (
    <section id="howtobuy" className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-16 text-center text-white">
          HOW TO BUY
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                {step.title}
              </h3>
              <p className="text-white/80 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToBuy;

