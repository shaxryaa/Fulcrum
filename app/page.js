import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Philosophy from '@/components/Philosophy';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Navbar />
      <Hero />
      <Features />
      <Philosophy />
      <Footer />
    </main>
  );
}
