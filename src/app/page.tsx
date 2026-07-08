import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
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