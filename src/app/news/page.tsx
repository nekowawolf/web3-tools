import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { web3ToolsMetadata } from "@/constants/metadataTemplates";
import DetailClient from "./DetailClient";

export const metadata = web3ToolsMetadata("News", "The latest news and updates.");

export default function NewsPage() {
  return (
    <>
      <Header />
      <DetailClient />
      <Footer />
    </>
  );
}
