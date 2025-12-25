"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Twitter, Send, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const Hero = () => {
  const [copied, setCopied] = useState(false);
  const contractAddress = "0x0000000000000000000000000000000000000000"; // Replace with actual CA

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    toast.success("Contract address copied to clipboard!", {
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = [
    { icon: Twitter, label: "Twitter/X", href: "https://twitter.com" },
    { icon: Send, label: "Telegram", href: "https://t.me" },
    { icon: TrendingUp, label: "DexScreener", href: "https://dexscreener.com" },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-[#001122]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,136,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Floating Mascot */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ 
            opacity: 1, 
            y: [0, -20, 0],
          }}
          transition={{ 
            opacity: { duration: 1 },
            y: { 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="mb-8 flex justify-center"
        >
          <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-[#00ff88] to-[#00d4ff] rounded-full flex items-center justify-center shadow-2xl shadow-[#00ff88]/50">
            <span className="text-6xl sm:text-8xl">🚀</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display mb-6 bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#ff00ff] bg-clip-text text-transparent"
          style={{ fontFamily: "var(--font-bangers)", letterSpacing: "0.02em" }}
        >
          [INSERT COIN NAME HERE]
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-2xl sm:text-3xl md:text-4xl font-display mb-4 text-[#00ff88]"
          style={{ fontFamily: "var(--font-bangers)" }}
        >
          $[INSERT TICKER HERE]
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg sm:text-xl text-white/70 mb-12 max-w-2xl mx-auto"
        >
          The most degenerate memecoin on the blockchain. No utility, just pure chaos and moon energy. 🚀🌙
        </motion.p>

        {/* Contract Address Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-black/50 backdrop-blur-sm border border-[#00ff88]/30 rounded-lg px-6 py-4 hover:border-[#00ff88] transition-colors cursor-pointer group"
            onClick={copyToClipboard}
          >
            <code className="text-sm sm:text-base text-[#00ff88] font-mono">
              {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
            </code>
            {copied ? (
              <Check className="w-5 h-5 text-[#00ff88]" />
            ) : (
              <Copy className="w-5 h-5 text-white/50 group-hover:text-[#00ff88] transition-colors" />
            )}
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex justify-center gap-6 flex-wrap"
        >
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm border border-[#00ff88]/30 rounded-full flex items-center justify-center hover:bg-[#00ff88]/20 hover:border-[#00ff88] transition-all"
                aria-label={social.label}
              >
                <Icon className="w-6 h-6 text-[#00ff88]" />
              </motion.a>
            );
          })}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-[#00ff88]/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-[#00ff88] rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

