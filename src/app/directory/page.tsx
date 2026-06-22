import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Web3ToolsContent from "./Web3ToolsContent";
import { dashboardMetadata } from "@/constants/metadataTemplates";

export const metadata = dashboardMetadata("Web3 Tools", "Web3 Tools Directory");

export default function Web3ToolsPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-24">
        <Web3ToolsContent />
      </main>
      <Footer />
    </>
  );
}