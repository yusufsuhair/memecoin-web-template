"use client";

import { motion } from "framer-motion";

const Marquee = () => {
  const ticker = "$[INSERT TICKER HERE]";
  const items = Array(20).fill(ticker);

  return (
    <section className="relative py-8 bg-gradient-to-r from-[#00ff88]/10 via-[#00d4ff]/10 to-[#00ff88]/10 overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -100 * items.length + "%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {[...items, ...items].map((item, index) => (
          <div
            key={index}
            className="text-4xl sm:text-5xl md:text-6xl font-display text-[#00ff88] px-8"
            style={{ fontFamily: "var(--font-bangers)" }}
          >
            {item} • 🚀 • {item} • 🌙 • {item} • 💎 •
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default Marquee;

