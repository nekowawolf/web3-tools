'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CgClose } from 'react-icons/cg';
import { GoSearch } from 'react-icons/go';
import { FallbackImage } from '@/components/FallbackImage';
import NwwOneeAIChat from '@/components/NwwOneeAIChat';
import Pagination from '@/components/Pagination';
import { Spinner } from '@/components/ui/spinner';
import { useWeb3Tools } from '@/hooks/useWeb3Tools';

const ITEMS_PER_PAGE = 8;

const categories = [
    'DEX',
    'CEX',
    'All',
    'DeFi',
    'Analytics',
    'Bridge',
    'Explorers',
    'Airdrop Tracker',
    'Quests',
    'Faucets',
    'Wallets',
    'Security',
    'Launchpad',
    'NFT Marketplace',
    'Research',
];

export default function Web3ToolsContent() {
    return (
        <Suspense fallback={
            <div className="flex min-h-[50vh] items-center justify-center">
                <Spinner className="size-10 text-blue-500" />
            </div>
        }>
            <Web3ToolsContentInner />
        </Suspense>
    );
}

function Web3ToolsContentInner() {
    const {
        displayedTools,
        loading,
        error,
        localSearchQuery,
        handleSearchChange,
        handleClearSearch,
        activeCategory,
        handleCategoryChange,
        currentPage,
        handlePageChange,
        totalPages,
        totalItems,
        suggestion,
        handleSuggestionClick,
    } = useWeb3Tools(ITEMS_PER_PAGE);

    const scrollRef = useRef<HTMLDivElement>(null);
    const fadeRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
        const checkOverflow = () => {
            if (!scrollRef.current || !fadeRef.current) return;

            const { scrollWidth, clientWidth, scrollLeft: currentScrollLeft } = scrollRef.current;
            const hasMore = Math.ceil(currentScrollLeft + clientWidth) < scrollWidth - 1;
            fadeRef.current.style.opacity = hasMore ? '1' : '0';
            fadeRef.current.style.visibility = hasMore ? 'visible' : 'hidden';
        };

        const timeoutId = window.setTimeout(checkOverflow, 50);
        const scrollElement = scrollRef.current;

        window.addEventListener('resize', checkOverflow);
        scrollElement?.addEventListener('scroll', checkOverflow);

        return () => {
            window.clearTimeout(timeoutId);
            window.removeEventListener('resize', checkOverflow);
            scrollElement?.removeEventListener('scroll', checkOverflow);
        };
    }, []);

    const onMouseDown = (event: React.MouseEvent) => {
        setIsDragging(true);
        if (scrollRef.current) {
            setStartX(event.pageX - scrollRef.current.offsetLeft);
            setScrollLeft(scrollRef.current.scrollLeft);
        }
    };

    const onMouseMove = (event: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        event.preventDefault();
        const x = event.pageX - scrollRef.current.offsetLeft;
        scrollRef.current.scrollLeft = scrollLeft - (x - startX);
    };

    return (
        <div className="min-h-screen body-color p-4 pt-10 text-fill-color sm:p-8 sm:pt-12 font-sans">
            <div className="mx-auto flex max-w-7xl flex-col items-center">
                <div className="mb-8 w-full max-w-2xl text-center">
                    <h1 className="mb-2 text-3xl font-bold">Web3 Tools List</h1>
                    <p className="mx-auto max-w-md text-sm leading-relaxed text-fill-color/70 sm:text-base">
                        Explore our curated collection of essential crypto and Web3 tools for every chain.
                    </p>
                </div>

                <div className="search-container relative mb-6 w-full max-w-xl">
                    <GoSearch className="search-icon absolute left-4 top-1/2 size-5 -translate-y-1/2 text-fill-color" />
                    <input
                        type="text"
                        aria-label="Search Web3 tools"
                        placeholder="Search Web3 Tools"
                        value={localSearchQuery}
                        onChange={handleSearchChange}
                        className="custom-search-focus w-full rounded-full border border-color card-color py-3 pl-12 pr-12 text-fill-color placeholder:text-fill-color/50"
                    />
                    {localSearchQuery && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-fill-color opacity-70 transition-opacity hover:opacity-100"
                            aria-label="Clear search"
                        >
                            <CgClose className="size-5" />
                        </button>
                    )}

                    <div className="pointer-events-none absolute left-0 top-full z-10 w-full pl-5 pt-1 text-left">
                        <div className={`pointer-events-auto text-xs text-fill-color/70 transition-opacity duration-300 ${suggestion ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                            Did you mean:{' '}
                            <button
                                type="button"
                                onClick={() => suggestion && handleSuggestionClick(suggestion)}
                                className="cursor-pointer font-semibold text-blue-500 hover:underline"
                            >
                                {suggestion}
                            </button>
                            ?
                        </div>
                    </div>
                </div>

                <div className="relative mx-auto mb-10 w-full overflow-hidden md:max-w-3xl">
                    <div
                        ref={scrollRef}
                        onMouseDown={onMouseDown}
                        onMouseLeave={() => setIsDragging(false)}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseMove={onMouseMove}
                        className={`flex items-center gap-2 overflow-x-auto md:pb-3 max-md:[&::-webkit-scrollbar]:hidden max-md:[-ms-overflow-style:none] max-md:[scrollbar-width:none] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-500/30 hover:[&::-webkit-scrollbar-thumb]:bg-blue-500/60 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                    >
                        {categories.map((category) => (
                            <button
                                type="button"
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium leading-none transition-colors duration-200 ${
                                    activeCategory === category
                                        ? 'bg-blue-600 text-white'
                                        : 'border border-color card-color text-fill-color/70 hover:!border-blue-600 hover:!text-[var(--fill-color)]'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <div
                        ref={fadeRef}
                        className="pointer-events-none absolute right-0 top-0 h-8 w-12 bg-gradient-to-l from-blue-600/20 to-transparent transition-opacity duration-200"
                        style={{ opacity: 0, visibility: 'hidden' }}
                    />
                </div>

                {loading ? (
                    <div className="flex w-full max-w-7xl justify-center p-12">
                        <Spinner className="size-10 text-blue-500" />
                    </div>
                ) : (
                    <div className="flex w-full flex-col items-center gap-4">
                        {error && (
                            <div className="mb-4 w-full max-w-5xl rounded-lg border border-red-500/20 bg-red-500/10 py-4 text-center text-red-500">
                                Error loading Web3 tools: {error}
                            </div>
                        )}

                        <div className="grid w-full max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                            {displayedTools.length > 0 ? (
                                displayedTools.map((tool) => {
                                    const chains = tool.chains ?? [];

                                    return (
                                        <Link
                                            href={`/directory/${tool._id}`}
                                            key={tool._id}
                                            className="glass-card card-hover group flex h-full min-w-0 flex-col items-center rounded-2xl p-4 text-center sm:p-5"
                                        >
                                            <div className="relative mx-auto mb-4 aspect-square w-full max-w-[72px] overflow-hidden rounded-xl bg-card-color transition-transform group-hover:scale-105 sm:max-w-[80px]">
                                                <FallbackImage
                                                    src={tool.image_url}
                                                    alt={tool.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>

                                            <h2 className="mb-2 w-full truncate text-base font-bold text-fill-color sm:text-lg">
                                                {tool.name}
                                            </h2>

                                            <div className="flex w-full flex-wrap justify-center gap-1.5">
                                                {tool.category && (
                                                    <span className="max-w-full truncate rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400">
                                                        {tool.category}
                                                    </span>
                                                )}
                                                {chains.length > 0 && (
                                                    <span className="max-w-[92px] truncate rounded-md border border-color bg-card-color px-2 py-0.5 text-[10px] text-fill-color/70">
                                                        {chains[0]}
                                                    </span>
                                                )}
                                                {chains.length > 1 && (
                                                    <span className="rounded-md border border-color bg-card-color px-2 py-0.5 text-[10px] font-bold text-fill-color/70">
                                                        +{chains.length - 1}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="col-span-full flex w-full flex-col gap-4">
                                    <div className="py-1 text-center">
                                        <FallbackImage
                                            src="https://cdn.nekowawolf.xyz/image/2026/1787422427_nwwonee_search.webp"
                                            alt="No data found"
                                            width={160}
                                            height={160}
                                            className="mx-auto"
                                        />
                                        <p className="-mt-4 text-fill-color/50">No data available.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {displayedTools.length > 0 && totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                itemsPerPage={ITEMS_PER_PAGE}
                                totalItems={totalItems}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                )}
            </div>
            <NwwOneeAIChat />
        </div>
    );
}