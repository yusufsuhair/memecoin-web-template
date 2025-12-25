"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Rocket, Megaphone, TrendingUp } from "lucide-react";

const Roadmap = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const phases = [
    {
      phase: "Phase 1",
      title: "Launch",
      icon: Rocket,
      color: "#00ff88",
      items: [
        "Token deployment on Solana/Ethereum",
        "Liquidity pool creation",
        "Community building",
        "Initial marketing push",
      ],
    },
    {
      phase: "Phase 2",
      title: "Marketing",
      icon: Megaphone,
      color: "#00d4ff",
      items: [
        "Influencer partnerships",
        "Social media campaigns",
        "Community contests and giveaways",
        "Memes and viral content",
      ],
    },
    {
      phase: "Phase 3",
      title: "CEX Listings",
      icon: TrendingUp,
      color: "#ff00ff",
      items: [
        "Tier 1 exchange listings",
        "Increased liquidity",
        "Global expansion",
        "To the moon! 🚀",
      ],
    },
  ];

  return (
    <section id="roadmap" className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-display mb-16 text-center text-[#00ff88]"
            style={{ fontFamily: "var(--font-bangers)" }}
          >
            Roadmap
          </motion.h2>

          <div className="relative">
            {/* Timeline Line (Desktop) */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#00ff88] via-[#00d4ff] to-[#ff00ff]" />

            <div className="space-y-12 md:space-y-24">
              {phases.map((phase, index) => {
                const Icon = phase.icon;
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={phase.phase}
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
                    transition={{ delay: 0.3 + index * 0.2, duration: 0.8 }}
                    className={`relative flex flex-col md:flex-row items-center gap-8 ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-black bg-[#00ff88] z-10" 
                      style={{ backgroundColor: phase.color }}
                    />

                    {/* Card */}
                    <div
                      className={`w-full md:w-5/12 bg-black/50 backdrop-blur-sm border rounded-xl p-6 md:p-8 ${
                        isEven
                          ? "md:mr-auto border-[#00ff88]/30"
                          : "md:ml-auto border-[#00d4ff]/30"
                      }`}
                      style={{
                        borderColor: `${phase.color}30`,
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${phase.color}20` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: phase.color }} />
                        </div>
                        <div>
                          <p className="text-sm text-white/50">{phase.phase}</p>
                          <h3
                            className="text-2xl font-bold"
                            style={{ color: phase.color }}
                          >
                            {phase.title}
                          </h3>
                        </div>
                      </div>
                      <ul className="space-y-2 mt-6">
                        {phase.items.map((item, itemIndex) => (
                          <motion.li
                            key={itemIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                            transition={{ delay: 0.5 + index * 0.2 + itemIndex * 0.1 }}
                            className="flex items-start gap-2 text-white/80"
                          >
                            <span className="text-[#00ff88] mt-1">•</span>
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Roadmap;

