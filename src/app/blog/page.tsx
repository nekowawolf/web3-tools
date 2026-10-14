import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { web3ToolsMetadata } from "@/constants/metadataTemplates";
import DetailClient from "./DetailClient";
import { fetchBlogPosts } from "@/services/blogService";

export const metadata = web3ToolsMetadata("Blog", "Articles, reviews, and deep dives covering Web3 tools.");

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await fetchBlogPosts();
  return (
    <>
      <Header />
      <DetailClient posts={posts} />
      <Footer />
    </>
  );
}