"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const Tokenomics = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const totalSupply = "1,000,000,000";
  const tax = "0/0";
  const liquidityBurned = true;

  // Pie chart data (simplified visual representation)
  const tokenDistribution = [
    { label: "Public Sale", value: 80, color: "#00ff88" },
    { label: "Liquidity", value: 15, color: "#00d4ff" },
    { label: "Team", value: 5, color: "#ff00ff" },
  ];

  return (
    <section id="tokenomics" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-[#001122]">
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
            className="text-4xl sm:text-5xl md:text-6xl font-display mb-12 text-center text-[#00ff88]"
            style={{ fontFamily: "var(--font-bangers)" }}
          >
            Tokenomics
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Stats Cards */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="bg-black/50 backdrop-blur-sm border border-[#00ff88]/30 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold mb-4 text-[#00ff88]">Total Supply</h3>
                <p className="text-3xl font-bold text-white">{totalSupply}</p>
                <p className="text-sm text-white/50 mt-2">Tokens</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="bg-black/50 backdrop-blur-sm border border-[#00ff88]/30 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold mb-4 text-[#00ff88]">Tax</h3>
                <p className="text-3xl font-bold text-white">{tax}%</p>
                <p className="text-sm text-white/50 mt-2">Buy/Sell Tax</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="bg-black/50 backdrop-blur-sm border border-[#00ff88]/30 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold mb-4 text-[#00ff88]">Liquidity</h3>
                <div className="flex items-center gap-2">
                  {liquidityBurned ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-[#00ff88]" />
                      <p className="text-xl font-bold text-[#00ff88]">Burned 🔥</p>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-500" />
                      <p className="text-xl font-bold text-red-500">Not Burned</p>
                    </>
                  )}
                </div>
                <p className="text-sm text-white/50 mt-2">Liquidity is locked forever</p>
              </motion.div>
            </div>

            {/* Distribution Chart */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-black/50 backdrop-blur-sm border border-[#00ff88]/30 rounded-xl p-8"
            >
              <h3 className="text-2xl font-semibold mb-8 text-[#00ff88] text-center">Distribution</h3>
              
              {/* Simple Pie Chart Visualization */}
              <div className="relative w-64 h-64 mx-auto mb-8">
                <svg className="transform -rotate-90" viewBox="0 0 200 200">
                  {tokenDistribution.map((item, index) => {
                    const previousValue = tokenDistribution
                      .slice(0, index)
                      .reduce((acc, curr) => acc + curr.value, 0);
                    const offset = (previousValue / 100) * 628.32; // 2 * π * 100
                    const strokeDasharray = (item.value / 100) * 628.32;
                    
                    return (
                      <circle
                        key={item.label}
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="40"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={-offset}
                        className="transition-all duration-1000"
                        style={{
                          strokeDasharray: isInView ? `${strokeDasharray} 628.32` : "0 628.32",
                        }}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">100%</div>
                    <div className="text-sm text-white/50">Allocated</div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                {tokenDistribution.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-white/80">{item.label}</span>
                    </div>
                    <span className="text-[#00ff88] font-semibold">{item.value}%</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Tokenomics;

