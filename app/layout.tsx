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
  title: "[INSERT COIN NAME HERE] - The Ultimate Memecoin",
  description: "Join the revolution. The most degenerate memecoin on the blockchain.",
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
