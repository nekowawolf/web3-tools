import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { web3ToolsMetadata } from '@/constants/metadataTemplates';
import SupportUsClient from './SupportUsClient';

export const metadata = web3ToolsMetadata('Support Us', 'Support the Nww ecosystem and help us keep building.');

export default function SupportUsPage() {
    return (
        <>
            <Header />
            <SupportUsClient />
            <Footer />
        </>
    );
}