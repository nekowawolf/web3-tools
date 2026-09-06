import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Web3Tool } from '@/types/web3tool';
import { fetchWeb3ToolsData } from '@/services/web3ToolService';
import Fuse from 'fuse.js';

let isInitialLoad = true;

export const useWeb3Tools = (itemsPerPage: number = 8) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [toolsData, setToolsData] = useState<Web3Tool[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.get('q') || '');
    const [localCategory, setLocalCategory] = useState(searchParams.get('category') || 'All');
    const [localPage, setLocalPage] = useState(Number(searchParams.get('page')) || 1);
    const [suggestion, setSuggestion] = useState<string | null>(null);

    useEffect(() => {
        if (!localSearchQuery || toolsData.length === 0) {
            setSuggestion(null);
            return;
        }

        const exactMatchExists = toolsData.some(t => 
            t.name.toLowerCase().includes(localSearchQuery.toLowerCase())
        );

        if (exactMatchExists) {
            setSuggestion(null);
            return;
        }

        const fuse = new Fuse(toolsData, {
            keys: ['name'],
            threshold: 0.4,
        });

        const results = fuse.search(localSearchQuery);
        if (results.length > 0) {
            const bestMatch = results[0].item.name;
            if (bestMatch.toLowerCase() !== localSearchQuery.toLowerCase()) {
                setSuggestion(bestMatch);
            } else {
                setSuggestion(null);
            }
        } else {
            setSuggestion(null);
        }
    }, [localSearchQuery, toolsData]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                let forceShuffle = false;
                if (isInitialLoad) {
                    isInitialLoad = false;
                    const urlParams = new URLSearchParams(window.location.search);
                    const page = Number(urlParams.get('page')) || 1;
                    if (page === 1) {
                        forceShuffle = true;
                    }
                }

                const data = await fetchWeb3ToolsData();
                let finalData = [...data];

                if (typeof sessionStorage !== 'undefined') {
                    const cachedOrderStr = sessionStorage.getItem('web3ToolsOrder');
                    const getToolKey = (t: any) => t._id || t.id || t.name;
                    
                    if (cachedOrderStr && !forceShuffle) {
                        try {
                            const cachedOrder: string[] = JSON.parse(cachedOrderStr);
                            const orderMap = new Map<string, number>(cachedOrder.map((id, index) => [id, index]));
                            finalData.sort((a, b) => {
                                const aKey = getToolKey(a);
                                const bKey = getToolKey(b);
                                const aIdx = orderMap.has(aKey) ? orderMap.get(aKey)! : 99999;
                                const bIdx = orderMap.has(bKey) ? orderMap.get(bKey)! : 99999;
                                return aIdx - bIdx;
                            });
                        } catch (e) {
                            console.error('Failed to parse cached order', e);
                        }
                    } else {
                        for (let i = finalData.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [finalData[i], finalData[j]] = [finalData[j], finalData[i]];
                        }
                        const order = finalData.map(t => getToolKey(t));
                        sessionStorage.setItem('web3ToolsOrder', JSON.stringify(order));
                    }
                }

                setToolsData(finalData);
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
                const params = new URLSearchParams(window.location.search);
                if (localSearchQuery) params.set('q', localSearchQuery);
                else params.delete('q');
                params.set('page', '1');
                
                const queryString = params.toString();
                const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
                window.history.pushState(null, '', newUrl);
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [localSearchQuery, pathname, searchParams]);

    const updateURL = (newCategory: string, newQuery: string, newPage: number) => {
        const params = new URLSearchParams();
        if (newCategory !== 'All') params.set('category', newCategory);
        if (newQuery) params.set('q', newQuery);
        if (newPage > 1) params.set('page', newPage.toString());
        
        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        window.history.pushState(null, '', newUrl);
    };

    const handleCategoryChange = (category: string) => {
        setLocalCategory(category);
        setLocalPage(1);
        updateURL(category, localSearchQuery, 1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchQuery(e.target.value);
        setLocalPage(1);
    };

    const handlePageChange = (page: number) => {
        setLocalPage(page);
        updateURL(localCategory, localSearchQuery, page);
    };

    const filteredTools = useMemo(() => {
        return toolsData.filter(tool => {
            const matchesSearch = tool.name.toLowerCase().includes(localSearchQuery.toLowerCase());
            const matchesCategory = localCategory === 'All' || tool.category === localCategory;
            return matchesSearch && matchesCategory;
        });
    }, [toolsData, localSearchQuery, localCategory]);

    useEffect(() => {
        const currentQ = searchParams.get('q') || '';
        const currentCat = searchParams.get('category') || 'All';
        const currentPg = Number(searchParams.get('page')) || 1;
        
        setLocalSearchQuery(currentQ);
        setLocalCategory(currentCat);
        setLocalPage(currentPg);
    }, [searchParams.get('q'), searchParams.get('category'), searchParams.get('page')]);

    const totalItems = filteredTools.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const validCurrentPage = Math.min(Math.max(1, localPage), totalPages);

    const displayedTools = useMemo(() => {
        const startIndex = (validCurrentPage - 1) * itemsPerPage;
        return filteredTools.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredTools, validCurrentPage, itemsPerPage]);

    const handleClearSearch = () => {
        setLocalSearchQuery('');
        setLocalPage(1);
    };

    const handleSuggestionClick = (newQuery: string) => {
        setLocalSearchQuery(newQuery);
        setLocalPage(1);
    };

    return {
        displayedTools,
        loading,
        error,
        localSearchQuery,
        handleSearchChange,
        handleClearSearch,
        activeCategory: localCategory,
        handleCategoryChange,
        currentPage: validCurrentPage,
        handlePageChange,
        totalPages,
        totalItems,
        suggestion,
        handleSuggestionClick
    };
};