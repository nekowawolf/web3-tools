'use client';

import NwwOneeAIChat from "@/components/NwwOneeAIChat";
import { useState, Suspense, useRef, useEffect } from 'react';
import { FallbackImage } from '@/components/FallbackImage';
import Pagination from '@/components/Pagination';
import { FaXTwitter, FaTelegram, FaInstagram, FaYoutube } from 'react-icons/fa6';
import { BsDiscord } from 'react-icons/bs';
import { RiExternalLinkLine } from 'react-icons/ri';
import { FaTimes } from 'react-icons/fa';
import { CgClose } from "react-icons/cg";
import { useWeb3Tools } from '@/hooks/useWeb3Tools';
import { Spinner } from '@/components/ui/spinner';
import { Web3Tool } from '@/types/web3tool';

const ITEMS_PER_PAGE = 8;

const categories = [  
    "DEX",
    "CEX",
    "All",
    "DeFi",
    "Analytics",
    "Bridge",
    "Explorers",
    "Airdrop Tracker",
    "Quests",
    "Faucets",
    "Wallets",
    "Security",
    "Launchpad",
    "NFT Marketplace",
    "Research"
];

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
        totalItems
    } = useWeb3Tools(ITEMS_PER_PAGE);

    // Modal state
    const [selectedTool, setSelectedTool] = useState<Web3Tool | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const fadeRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
        const checkOverflow = () => {
            if (scrollRef.current && fadeRef.current) {
                const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
                const hasMore = Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1;
                fadeRef.current.style.opacity = hasMore ? '1' : '0';
                fadeRef.current.style.visibility = hasMore ? 'visible' : 'hidden';
            }
        };

        const timeoutId = setTimeout(checkOverflow, 50);
        
        window.addEventListener('resize', checkOverflow);
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', checkOverflow);
        }
        
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', checkOverflow);
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', checkOverflow);
            }
        };
    }, [categories.length]);

    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        if (scrollRef.current) {
            setStartX(e.pageX - scrollRef.current.offsetLeft);
            setScrollLeft(scrollRef.current.scrollLeft);
        }
    };

    const onMouseLeave = () => {
        setIsDragging(false);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX);
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="min-h-screen body-color text-fill-color p-8 pt-12 font-sans">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <div className="w-full max-w-2xl mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">
                        Web3 Tools Directory
                    </h1>
                    <p className="text-fill-color/70 max-w-md mx-auto">
                        Explore our curated collection of essential crypto and Web3 platforms to elevate your journey.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="w-full max-w-xl mb-6 relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-fill-color/50">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                    <input
                        type="text"
                        placeholder="Search Web3 Tools"
                        value={localSearchQuery}
                        onChange={handleSearchChange}
                        className="w-full py-3 pl-12 pr-12 rounded-full card-color border border-color focus:outline-none focus:border-blue-500 text-fill-color placeholder:text-fill-color/50 transition-colors"
                    />
                    {localSearchQuery && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity text-fill-color cursor-pointer"
                            aria-label="Clear search"
                        >
                            <CgClose className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Categories */}
                <div className="relative w-full md:max-w-3xl mb-10 overflow-hidden">
                    <div 
                        ref={scrollRef}
                        onMouseDown={onMouseDown}
                        onMouseLeave={onMouseLeave}
                        onMouseUp={onMouseUp}
                        onMouseMove={onMouseMove}
                        className={`flex overflow-x-auto gap-2 items-center md:pb-3 max-md:[&::-webkit-scrollbar]:hidden max-md:[-ms-overflow-style:none] max-md:[scrollbar-width:none] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-blue-500/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-blue-500/60 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                    >
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium leading-none transition-colors duration-200 cursor-pointer ${
                                    activeCategory === category
                                        ? 'bg-blue-600 text-white'
                                        : 'card-color text-fill-color/70 border border-color hover:!text-[var(--fill-color)] hover:!border-blue-600'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    {/* Fade indicator */}
                    <div 
                        ref={fadeRef}
                        className="absolute right-0 top-0 h-8 w-12 bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none transition-opacity duration-200"
                        style={{ opacity: 0, visibility: 'hidden' }}
                    />
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex justify-center p-12 w-full max-w-7xl">
                        <Spinner className="text-blue-500 size-10" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 w-full items-center">
                        {error && (
                            <div className="text-red-500 text-center py-4 bg-red-500/10 rounded-lg border border-red-500/20 w-full max-w-7xl mb-4">
                                Error loading Web3 tools: {error}
                            </div>
                        )}

                        {/* Tools Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl">
                            {displayedTools.length > 0 ? (
                                displayedTools.map((tool) => (
                                    <div
                                        key={tool._id}
                                        onClick={() => setSelectedTool(tool)}
                                        className="glass-card rounded-2xl p-5 flex flex-col h-full card-hover transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-card-color shrink-0">
                                                <FallbackImage
                                                    src={tool.imageUrl}
                                                    alt={tool.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-lg font-bold text-fill-color leading-tight">
                                                        {tool.website ? (
                                                            <a 
                                                                href={tool.website} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="cursor-pointer transition-colors"
                                                            >
                                                                {tool.name}
                                                            </a>
                                                        ) : (
                                                            tool.name
                                                        )}
                                                    </h3>
                                                    {tool.website && (
                                                        <a 
                                                            href={tool.website} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="opacity-70 hover:opacity-100 transition-opacity text-fill-color cursor-pointer"
                                                            aria-label="Website"
                                                            title="Visit Website"
                                                        >
                                                            <RiExternalLinkLine className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                </div>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    {tool.category}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-sm text-fill-color/70 mb-4 flex-grow line-clamp-3">
                                            {tool.description}
                                        </p>

                                        <div className="mb-4">
                                            <h4 className="text-xs font-semibold text-fill-color/50 mb-2 uppercase tracking-wider">Supported Chains</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {tool.chains && tool.chains.slice(0, 5).map((chain, index) => (
                                                    <span key={index} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                        {chain}
                                                    </span>
                                                ))}
                                                {tool.chains && tool.chains.length > 5 && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-md border border-color bg-card-color text-fill-color/70 font-bold">
                                                        +{tool.chains.length - 5}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mt-auto pt-4">
                                            {tool.twitter && (
                                                <a href={tool.twitter} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color cursor-pointer" aria-label="Twitter">
                                                    <FaXTwitter className="w-5 h-5" />
                                                </a>
                                            )}
                                            {tool.instagram && (
                                                <a href={tool.instagram} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color cursor-pointer" aria-label="Instagram">
                                                    <FaInstagram className="w-5 h-5" />
                                                </a>
                                            )}
                                            {tool.youtube && (
                                                <a href={tool.youtube} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color cursor-pointer" aria-label="YouTube">
                                                    <FaYoutube className="w-5 h-5" />
                                                </a>
                                            )}
                                            {tool.discord && (
                                                <a href={tool.discord} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color cursor-pointer" aria-label="Discord">
                                                    <BsDiscord className="w-5 h-5" />
                                                </a>
                                            )}
                                            {tool.telegram && (
                                                <a href={tool.telegram} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color cursor-pointer" aria-label="Telegram">
                                                    <FaTelegram className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full w-full flex-col flex gap-4">
                                    <div className="text-center py-1">
                                        <FallbackImage
                                            src="https://nekowawolf.github.io/cdn-images/images/2026/1784476217_nwwonee_search.webp"
                                            alt="No data found"
                                            width={160}
                                            height={160}
                                            className="mx-auto"
                                        />
                                        <p className="text-fill-color/50 -mt-4">No data available.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
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

            {/* Modal Popup */}
            {selectedTool && (
                <div 
                    className="cursor-pointer fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setSelectedTool(null)}
                >
                    <div 
                        className="cursor-auto glass-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-color shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setSelectedTool(null)}
                            className="absolute top-4 right-4 opacity-70 hover:opacity-100 transition-opacity text-fill-color cursor-pointer"
                        >
                            <FaTimes size={20} />
                        </button>
                        
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-card-color2 shrink-0">
                                    <FallbackImage
                                        src={selectedTool.imageUrl}
                                        alt={selectedTool.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h2 className="text-2xl font-bold text-fill-color leading-tight">
                                            {selectedTool.website ? (
                                                <a 
                                                    href={selectedTool.website} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="cursor-pointer transition-colors"
                                                >
                                                    {selectedTool.name}
                                                </a>
                                            ) : (
                                                selectedTool.name
                                            )}
                                        </h2>
                                        {selectedTool.website && (
                                            <a 
                                                href={selectedTool.website} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity text-fill-color"
                                                title="Visit Website"
                                            >
                                                <RiExternalLinkLine className="w-6 h-6" />
                                            </a>
                                        )}
                                    </div>
                                    <span className="text-sm px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                        {selectedTool.category}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-fill-color/50 mb-2 uppercase tracking-wider">About</h4>
                                <div className="max-h-40 overflow-y-auto pr-2">
                                    <p className="text-base text-fill-color/80 leading-relaxed whitespace-pre-wrap">
                                        {selectedTool.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-sm font-semibold text-fill-color/50 mb-3 uppercase tracking-wider">Supported Chains</h4>
                                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar pr-2">
                                    {selectedTool.chains && selectedTool.chains.map((chain, index) => (
                                        <span key={index} className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            {chain}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-5 pt-6 mt-auto">
                                {selectedTool.twitter && (
                                    <a href={selectedTool.twitter} target="_blank" rel="noopener noreferrer" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity text-fill-color" aria-label="Twitter">
                                        <FaXTwitter className="w-6 h-6" />
                                    </a>
                                )}
                                {selectedTool.instagram && (
                                    <a href={selectedTool.instagram} target="_blank" rel="noopener noreferrer" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity text-fill-color" aria-label="Instagram">
                                        <FaInstagram className="w-6 h-6" />
                                    </a>
                                )}
                                {selectedTool.youtube && (
                                    <a href={selectedTool.youtube} target="_blank" rel="noopener noreferrer" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity text-fill-color" aria-label="YouTube">
                                        <FaYoutube className="w-6 h-6" />
                                    </a>
                                )}
                                {selectedTool.discord && (
                                    <a href={selectedTool.discord} target="_blank" rel="noopener noreferrer" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity text-fill-color" aria-label="Discord">
                                        <BsDiscord className="w-6 h-6" />
                                    </a>
                                )}
                                {selectedTool.telegram && (
                                    <a href={selectedTool.telegram} target="_blank" rel="noopener noreferrer" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity text-fill-color" aria-label="Telegram">
                                        <FaTelegram className="w-6 h-6" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <NwwOneeAIChat />
        </div>
    );
}

export default function Web3ToolsContent() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[50vh]">
                <Spinner className="text-blue-500 size-10" />
            </div>
        }>
            <Web3ToolsContentInner />
        </Suspense>
    );
}