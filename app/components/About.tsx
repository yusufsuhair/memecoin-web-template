"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Text Content */}
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl font-display mb-6 text-[#00ff88]"
              style={{ fontFamily: "var(--font-bangers)" }}
            >
              The Legend Begins
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-4 text-lg text-white/80 leading-relaxed"
            >
              <p>
                In the depths of the crypto universe, where dreams are made and wallets are broken, 
                a legend was born. [INSERT COIN NAME HERE] emerged from the chaos, not as a utility token, 
                not as a governance coin, but as pure, unadulterated memecoin energy.
              </p>
              <p>
                Born from the collective degeneracy of anons who had seen too many green candles and 
                not enough sleep, this coin represents everything that makes crypto beautiful: 
                irrational exuberance, diamond hands, and the unwavering belief that this time, 
                it's different.
              </p>
              <p>
                No roadmap? No problem. No utility? Who needs it. We're here for one thing and one thing only: 
                to the moon. 🚀
              </p>
            </motion.div>
          </div>

          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-[#00ff88]/20 to-[#00d4ff]/20 rounded-2xl p-8 border border-[#00ff88]/30 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🎭</div>
                <p className="text-white/50 text-sm">Mascot Image Placeholder</p>
                <p className="text-white/30 text-xs mt-2">Replace with your mascot image</p>
              </div>
            </div>
            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#00ff88]/20 to-[#00d4ff]/20 blur-2xl -z-10 rounded-2xl" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

