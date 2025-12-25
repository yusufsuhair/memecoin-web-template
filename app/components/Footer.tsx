"use client";

import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} [INSERT COIN NAME HERE]. All rights reserved.
          </p>
          <p className="text-white/40 text-xs max-w-2xl mx-auto">
            <strong>Disclaimer:</strong> This is a memecoin with no intrinsic value or expectation of financial return. 
            This is not an investment. DYOR (Do Your Own Research). The coin is for entertainment purposes only. 
            Not financial advice. Invest at your own risk. You may lose all of your money.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

