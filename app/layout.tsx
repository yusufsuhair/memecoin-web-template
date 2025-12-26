import type { Metadata } from "next";
import { Bangers, Inter } from "next/font/google";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import WalletContextProvider from "./components/WalletProvider";

const bangers = Bangers({
  weight: "400",
  variable: "--font-bangers",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "$MEME - The Ultimate Memecoin",
  description: "The most memeable memecoin in existence. The dogs have had their day, it's time for MEME to take reign.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${bangers.variable} ${inter.variable} antialiased bg-black text-white`}
      >
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
