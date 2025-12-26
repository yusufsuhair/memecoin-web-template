"use client";

const Footer = () => {
  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo Section */}
          <div className="text-center md:text-left">
            <div className="text-3xl font-bold text-white mb-4">
              MEME
            </div>
            <p className="text-white/60 text-sm">
              The most memeable memecoin in existence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-white/60 hover:text-white transition-colors text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#howtobuy" className="text-white/60 hover:text-white transition-colors text-sm">
                  How to Buy
                </a>
              </li>
              <li>
                <a href="#tokenomics" className="text-white/60 hover:text-white transition-colors text-sm">
                  Tokenomics
                </a>
              </li>
              <li>
                <a href="#roadmap" className="text-white/60 hover:text-white transition-colors text-sm">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex justify-center md:justify-start gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Twitter"
              >
                <span className="text-white text-2xl">🐦</span>
              </a>
              <a
                href="https://etherscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Etherscan"
              >
                <span className="text-white text-2xl">🔍</span>
              </a>
              <a
                href="https://uniswap.org"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Uniswap"
              >
                <span className="text-white text-2xl">🦄</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Disclaimer */}
        <div className="space-y-4 text-xs text-white/50 max-w-4xl mx-auto text-center mb-8 leading-relaxed">
          <p>
            $MEME coin has no association with any original creator. This token is simply paying homage to a meme we all love and recognize.
          </p>
          <p>
            $MEME is a meme coin with no intrinsic value or expectation of financial return. There is no formal team or roadmap. 
            The coin is completely useless and for entertainment purposes only.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center pt-4 border-t border-white/10">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} by MEME. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
