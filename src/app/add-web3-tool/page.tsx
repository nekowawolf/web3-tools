import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { web3ToolsMetadata } from '@/constants/metadataTemplates';
import AddWeb3ToolClient from './AddWeb3ToolClient';

export const metadata = web3ToolsMetadata('Add Web3 Tool', 'Submit a Web3 Tool to the Nww Web3 Tools directory.');

export default function AddWeb3ToolPage() {
    return (
        <>
            <Header />
            <AddWeb3ToolClient />
            <Footer />
        </>
    );
}