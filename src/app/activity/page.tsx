import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { web3ToolsMetadata } from "@/constants/metadataTemplates";
import DetailClient from "./DetailClient";

export const metadata = web3ToolsMetadata("Activity", "See the latest Web3 Tools, Nww ecosystem supporters, and project commits.");

export default function ActivityPage() {
  return (
    <>
      <Header />
      <DetailClient />
      <Footer />
    </>
  );
}