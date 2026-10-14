import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { web3ToolsMetadata } from '@/constants/metadataTemplates';
import { fetchWeb3ToolById } from '@/services/web3ToolService';
import DetailClient from './DetailClient';

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const tool = await fetchWeb3ToolById(id);

    if (!tool) {
        return web3ToolsMetadata('Not Found', 'Web3 tool not found');
    }

    return web3ToolsMetadata(tool.name, tool.description);
}

export default function Web3ToolDetails() {
    return (
        <>
            <Header />
            <DetailClient />
            <Footer />
        </>
    );
}