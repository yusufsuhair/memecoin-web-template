import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import HowToBuy from "./components/HowToBuy";
import Game from "./components/Game";
import Tokenomics from "./components/Tokenomics";
import Footer from "./components/Footer";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Toaster position="top-center" theme="dark" />
      <Navbar />
      <Hero />
      <About />
      <HowToBuy />
      <Game />
      <Tokenomics />
      <Footer />
    </main>
  );
}
