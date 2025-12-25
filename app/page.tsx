import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Game from "./components/Game";
import About from "./components/About";
import Tokenomics from "./components/Tokenomics";
import Roadmap from "./components/Roadmap";
import Footer from "./components/Footer";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Toaster position="top-center" theme="dark" />
      <Navbar />
      <Hero />
      <Game />
      <About />
      <Tokenomics />
      <Roadmap />
      <Footer />
    </main>
  );
}
