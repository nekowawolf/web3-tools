import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { web3ToolsMetadata } from "@/constants/metadataTemplates";
import DetailClient from "./DetailClient";

export const metadata = web3ToolsMetadata("Blog", "Articles, reviews, deep dives, and analysis.");

export default function BlogPage() {
  return (
    <>
      <Header />
      <DetailClient />
      <Footer />
    </>
  );
}
