"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import WalletButton from "./WalletButton";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "HOME", href: "#hero" },
    { name: "ABOUT", href: "#about" },
    { name: "HOW TO BUY", href: "#howtobuy" },
    { name: "TOKENOMICS", href: "#tokenomics" },
    { name: "ROADMAP", href: "#roadmap" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-xl font-bold">
            <a href="#hero" className="text-white hover:text-white/80 transition-colors">
              MEME
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
            <WalletButton />
            <a
              href="https://raydium.io/swap"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white text-black font-bold hover:bg-white/90 transition-colors text-sm"
            >
              Buy Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-white/80 hover:text-white transition-colors text-sm"
              >
                {link.name}
              </a>
            ))}
            <div className="flex justify-center pt-2">
              <WalletButton />
            </div>
            <a
              href="https://raydium.io/swap"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 bg-white text-black font-bold text-center text-sm"
            >
              Buy Now
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
