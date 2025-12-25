"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Wallet, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const WalletButton = () => {
  const { wallet, disconnect, publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all
        ${
          connected
            ? "bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black"
            : "bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black hover:shadow-lg hover:shadow-[#00ff88]/50"
        }
      `}
    >
      {connected ? (
        <>
          <Wallet className="w-4 h-4" />
          <span>{formatAddress(publicKey?.toBase58() || "")}</span>
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4" />
          <span>Connect Wallet</span>
        </>
      )}
    </motion.button>
  );
};

export default WalletButton;

