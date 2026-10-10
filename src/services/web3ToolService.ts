import { Web3Tool, Web3ToolSubmissionPayload } from '@/types/web3tool';

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

export const fetchWeb3ToolById = async (id: string): Promise<Web3Tool | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/web3tools/${encodeURIComponent(id)}`);
        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data?.data ?? data;
    } catch (error) {
        console.error('Error fetching Web3 tool by ID:', error);
        return null;
    }
};

export const submitWeb3Tool = async (payload: Web3ToolSubmissionPayload) => {
    const response = await fetch(`${API_BASE_URL}/web3-tool-submissions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to submit Web3 Tool');
    }

    return response.json();
};