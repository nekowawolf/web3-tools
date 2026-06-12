import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Web3ToolsContent from "./Web3ToolsContent";
import { Suspense } from "react";
import { dashboardMetadata } from "@/constants/metadataTemplates";

export const metadata = dashboardMetadata("Web3 Tools", "Web3 Tools Directory");

export default function Web3ToolsPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-24">
        <Suspense fallback={<div className="min-h-screen body-color text-fill-color p-8 pt-12 font-sans flex items-center justify-center">Loading...</div>}>
          <Web3ToolsContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}