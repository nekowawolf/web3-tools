import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { web3ToolsMetadata } from "@/constants/metadataTemplates";
import DetailClient from "./DetailClient";

export const metadata = web3ToolsMetadata("Activity", "Web activity.");

export default function ActivityPage() {
  return (
    <>
      <Header />
      <DetailClient />
      <Footer />
    </>
  );
}
