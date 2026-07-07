import { Web3Tool } from '@/types/web3tool';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchWeb3ToolsData = async (): Promise<Web3Tool[]> => {
    try {
        const fullUrl = `${API_BASE_URL}/web3tools`;
        console.log('Fetching Web3 tools data from:', fullUrl);

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText} (URL: ${fullUrl})`);
        }
        const data = await response.json();

        let resultData: Web3Tool[] = [];

        if (!Array.isArray(data)) {
            if (data && Array.isArray(data.data)) {
                resultData = data.data;
            } else {
                console.error('API did not return an array:', data);
                return [];
            }
        } else {
            resultData = data;
        }

        return resultData;
    } catch (error) {
        console.error('Error fetching Web3 tools data:', error);
        throw error;
    }
};