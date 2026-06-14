import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Web3Tool } from '@/types/web3tool';
import { fetchWeb3ToolsData } from '@/services/web3ToolService';

export const useWeb3Tools = (itemsPerPage: number = 8) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [toolsData, setToolsData] = useState<Web3Tool[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.get('q') || '');
    const activeCategory = searchParams.get('category') || 'All';
    const currentPage = Number(searchParams.get('page')) || 1;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await fetchWeb3ToolsData();
                setToolsData(data);
            } catch (err) {
                setError('Failed to fetch Web3 tools data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Debounce search URL update
    useEffect(() => {
        const handler = setTimeout(() => {
            const currentQ = searchParams.get('q') || '';
            if (localSearchQuery !== currentQ) {
                const params = new URLSearchParams(searchParams.toString());
                if (localSearchQuery) params.set('q', localSearchQuery);
                else params.delete('q');
                params.set('page', '1');
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [localSearchQuery, pathname, router, searchParams]);

    const updateURL = (newCategory: string, newQuery: string, newPage: number) => {
        const params = new URLSearchParams();
        if (newCategory !== 'All') params.set('category', newCategory);
        if (newQuery) params.set('q', newQuery);
        if (newPage > 1) params.set('page', newPage.toString());
        
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleCategoryChange = (category: string) => {
        updateURL(category, localSearchQuery, 1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchQuery(e.target.value);
    };

    const handlePageChange = (page: number) => {
        updateURL(activeCategory, localSearchQuery, page);
    };

    const filteredTools = useMemo(() => {
        return toolsData.filter(tool => {
            const matchesSearch = tool.name.toLowerCase().includes(localSearchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [toolsData, localSearchQuery, activeCategory]);

    const totalItems = filteredTools.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const displayedTools = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredTools.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredTools, currentPage, itemsPerPage]);

    return {
        displayedTools,
        loading,
        error,
        localSearchQuery,
        handleSearchChange,
        activeCategory,
        handleCategoryChange,
        currentPage,
        handlePageChange,
        totalPages,
        totalItems
    };
};
