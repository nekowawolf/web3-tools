import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import { web3ToolsMetadata } from "@/constants/metadataTemplates";

export const metadata = web3ToolsMetadata("Home", "Welcome to Nww");

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-24">
        <Hero />
      </main>
      <Footer />
    </>
  );
}