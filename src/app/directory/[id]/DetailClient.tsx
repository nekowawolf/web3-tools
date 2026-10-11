'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { BsDiscord } from 'react-icons/bs';
import { CiBookmark } from 'react-icons/ci';
import { FaExternalLinkAlt, FaNetworkWired, FaPlayCircle } from 'react-icons/fa';
import { FaInstagram, FaTelegram, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { HiOutlinePhotograph } from 'react-icons/hi';
import BackButton from '@/components/BackButton';
import { FallbackImage } from '@/components/FallbackImage';
import NwwOneeAIChat, { chatStore } from '@/components/NwwOneeAIChat';
import ZoomableImage from '@/components/ZoomableImage';
import { Spinner } from '@/components/ui/spinner';
import { fetchWeb3ToolsData } from '@/services/web3ToolService';
import { Web3Tool } from '@/types/web3tool';

const getSuggestions = (currentTool: Web3Tool, allTools: Web3Tool[]) => {
    const currentChains = new Set(currentTool.chains ?? []);
    const currentCategories = new Set(currentTool.categories ?? []);

    return allTools
        .filter((tool) => tool._id.toString() !== currentTool._id.toString())
        .map((tool) => {
            const sharedChains = (tool.chains ?? []).filter((chain) => currentChains.has(chain)).length;
            const sharedCategory = (tool.categories ?? []).some((category) => currentCategories.has(category));
            const score = (sharedCategory ? 4 : 0) + sharedChains;
            return { tool, score };
        })
        .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
        .slice(0, 6)
        .map(({ tool }) => tool);
};

const getYouTubeVideoId = (url: string) => {
    const match = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return match?.[2]?.length === 11 ? match[2] : null;
};

export default function DetailClient() {
    const params = useParams<{ id: string }>();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const [tool, setTool] = useState<Web3Tool | null>(null);
    const [suggestedTools, setSuggestedTools] = useState<Web3Tool[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchDetail = async () => {
            setLoading(true);

            try {
                const allTools = await fetchWeb3ToolsData();
                const foundTool = allTools.find((item) => item._id.toString() === id);

                setTool(foundTool ?? null);
                setSuggestedTools(foundTool ? getSuggestions(foundTool, allTools) : []);
            } catch (error) {
                console.error('Failed to load Web3 tool details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <main className="flex min-h-screen flex-grow items-center justify-center body-color px-4 pb-12 pt-36 text-fill-color sm:px-8 font-sans">
                <Spinner className="size-12 text-blue-500" />
            </main>
        );
    }

    if (!tool) return notFound();

    const chains = tool.chains ?? [];
    const socialLinks = [
        { name: 'X / Twitter', url: tool.twitter, icon: FaXTwitter },
        { name: 'Instagram', url: tool.instagram, icon: FaInstagram },
        { name: 'YouTube', url: tool.youtube, icon: FaYoutube },
        { name: 'Discord', url: tool.discord, icon: BsDiscord },
        { name: 'Telegram', url: tool.telegram, icon: FaTelegram },
    ].filter((social) => Boolean(social.url));

    return (
        <main className="min-h-screen flex-grow body-color px-4 pb-12 pt-32 text-fill-color sm:px-8 sm:pt-36 font-sans">
            <div className="mx-auto max-w-4xl">
                <BackButton fallbackUrl="/directory" />

                <section className="glass-card relative mb-8 overflow-hidden rounded-3xl border border-white/10 p-7">
                    <button
                        type="button"
                        onClick={() => {
                            chatStore.setIsOpen(true);
                            chatStore.setActiveView('user');
                        }}
                        className="absolute right-6 top-6 z-20 cursor-pointer text-fill-color opacity-70 transition-all hover:opacity-100"
                        title="Bookmark"
                        aria-label={`Bookmark ${tool.name}`}
                    >
                        <CiBookmark className="size-6" />
                    </button>

                    <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5">
                        <FallbackImage
                            src={tool.image_url}
                            alt=""
                            width={256}
                            height={256}
                            className="size-64 object-contain"
                            unoptimized
                        />
                    </div>

                    <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row">
                        <FallbackImage
                            src={tool.image_url}
                            alt={tool.name}
                            width={112}
                            height={112}
                            className="size-28 shrink-0 rounded-2xl bg-black/20 object-contain p-2"
                            unoptimized
                        />

                        <div className="min-w-0 flex-1">
                            <h1 className="mb-2 break-words text-3xl font-bold">
                                {tool.name}
                            </h1>

                            {(tool.categories?.length ?? 0) > 0 && (
                                <div className="mb-4 flex flex-wrap gap-3">
                                    {tool.categories.map((category) => (
                                        <span key={category} className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
                                            {category}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <p className="max-w-2xl leading-relaxed text-fill-color/80">
                                {tool.description}
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-4">
                                {tool.website && (
                                    <a
                                        href={tool.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-[14.5px] font-medium text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-500 md:px-3 md:text-sm"
                                    >
                                        <FaExternalLinkAlt className="size-3.5" />
                                        Visit Website
                                    </a>
                                )}

                                {socialLinks.map(({ name, url, icon: Icon }) => (
                                    <a
                                        key={name}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cursor-pointer text-fill-color opacity-70 transition-opacity hover:opacity-100"
                                        aria-label={name}
                                        title={name}
                                    >
                                        <Icon className="size-[21px] sm:size-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="glass-card relative mb-8 overflow-hidden rounded-3xl border border-white/10 p-5 sm:p-7">
                    <div className="mb-6 flex items-center gap-3 border-b border-[var(--border-divider)] pb-4">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500">
                            <FaNetworkWired className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold sm:text-xl">Supported Chains</h2>
                            <p className="mt-0.5 whitespace-nowrap text-xs text-fill-color/60 sm:text-sm">
                                Networks supported by {tool.name}
                            </p>
                        </div>
                    </div>

                    {chains.length > 0 ? (
                        <div className="flex flex-nowrap gap-2 overflow-x-auto pb-3 sm:gap-3 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-500/30 hover:[&::-webkit-scrollbar-thumb]:bg-blue-500/60">
                            {chains.map((chain) => (
                                <span
                                    key={chain}
                                    className="shrink-0 whitespace-nowrap rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 sm:px-4 sm:text-sm"
                                >
                                    {chain}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-fill-color/60">Chain information is not available yet.</p>
                    )}
                </section>

                {/* Media Section */}
                {(tool.media?.video_url || (tool.media?.screenshot_urls && tool.media.screenshot_urls.length > 0)) && (
                    <div className="glass-card rounded-3xl p-7 mb-8 border border-white/10 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500">
                                <HiOutlinePhotograph className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold">Preview</h2>
                        </div>

                        {(() => {
                            const screenshots = tool.media?.screenshot_urls ?? [];
                            const videoCount = tool.media?.video_url ? 1 : 0;
                            const screenshotCount = screenshots.length;
                            const totalMedia = videoCount + screenshotCount;

                            return (
                                <div className={`w-full flex gap-4 overflow-x-auto pb-4 snap-x [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-blue-500/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-blue-500/60 ${totalMedia === 1 ? 'justify-center' : ''}`}>
                                    {/* Video Content */}
                                    {tool.media?.video_url && (
                                        <>
                                            {(() => {
                                                const url = tool.media.video_url;
                                                const videoId = getYouTubeVideoId(url);

                                                if (videoId) {
                                                    return (
                                                        <div className="flex-shrink-0 w-[75vw] sm:w-[85vw] md:w-[600px] aspect-video rounded-xl overflow-hidden border border-white/5 snap-center bg-black/40 relative">
                                                            <iframe
                                                                width="100%"
                                                                height="100%"
                                                                src={`https://www.youtube.com/embed/${videoId}`}
                                                                title="YouTube video player"
                                                                frameBorder="0"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                            ></iframe>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div className="flex-shrink-0 w-[75vw] sm:w-[85vw] md:w-[600px] aspect-video rounded-xl overflow-hidden border border-white/5 snap-center bg-black/40 relative flex items-center justify-center">
                                                        <a href={url} target="_blank" rel="noopener noreferrer" className="cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
                                                            <FaPlayCircle className="w-4 h-4" />
                                                            Watch Video
                                                        </a>
                                                    </div>
                                                );
                                            })()}
                                        </>
                                    )}

                                    {/* Screenshots Content */}
                                    {screenshots.map((url, index) => (
                                        <div key={index} className="flex-shrink-0 w-[75vw] sm:w-[85vw] md:w-[600px] aspect-video rounded-xl overflow-hidden border border-white/5 snap-center bg-black/40 relative">
                                            <ZoomableImage
                                                src={url}
                                                alt={`${tool.name} Screenshot ${index + 1}`}
                                                className="absolute inset-0 w-full h-full"
                                                imageClassName="w-full h-full object-cover"
                                                images={screenshots}
                                                currentIndex={index}
                                                fill
                                                unoptimized
                                            />
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>
                )}

                {suggestedTools.length > 0 && (
                    <section className="glass-card relative mb-8 mt-8 overflow-hidden rounded-3xl border border-[var(--border-divider)] p-5 sm:p-8">
                        <div className="relative z-10 mb-6 flex items-center gap-3 border-b border-[var(--border-divider)] pb-4">
                            <h2 className="text-xl font-bold text-fill-color sm:text-2xl">Explore Other Web3 Tools</h2>
                        </div>

                        <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2">
                            {suggestedTools.map((suggestedTool) => {
                                const suggestedChains = suggestedTool.chains ?? [];

                                return (
                                    <Link
                                        key={suggestedTool._id}
                                        href={`/directory/${suggestedTool._id}`}
                                        className="group flex h-full flex-col rounded-2xl border border-[var(--border-divider)] bg-[rgba(var(--fill-color-rgb),0.03)] p-4 transition-all hover:border-blue-500/30 hover:bg-[rgba(var(--fill-color-rgb),0.06)] sm:p-5"
                                    >
                                        <div className="mb-4 flex items-start justify-between gap-3 border-b border-[var(--border-divider)] pb-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <FallbackImage
                                                    src={suggestedTool.image_url}
                                                    alt={suggestedTool.name}
                                                    width={40}
                                                    height={40}
                                                    className="size-10 shrink-0 rounded-xl bg-black/20 object-contain p-1"
                                                    unoptimized
                                                />
                                                <h3 className="truncate text-sm font-bold transition-colors group-hover:text-blue-400">
                                                    {suggestedTool.name}
                                                </h3>
                                            </div>

                                            {(suggestedTool.categories?.length ?? 0) > 0 && (
                                                <div className="ml-2 flex shrink-0 items-center gap-1.5">
                                                    <span className="max-w-[110px] truncate rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400">
                                                        {suggestedTool.categories[0]}
                                                    </span>
                                                    {suggestedTool.categories.length > 1 && (
                                                        <span className="rounded-md border border-color bg-card-color px-2 py-0.5 text-[10px] font-bold text-fill-color/70">
                                                            +{suggestedTool.categories.length - 1}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <p className="line-clamp-2 flex-grow text-xs leading-relaxed text-fill-color/60">
                                            {suggestedTool.description}
                                        </p>

                                        {suggestedChains.length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-1.5">
                                                {suggestedChains.slice(0, 2).map((chain) => (
                                                    <span key={chain} className="rounded-md border border-color bg-card-color px-2 py-0.5 text-[10px] text-fill-color/70">
                                                        {chain}
                                                    </span>
                                                ))}
                                                {suggestedChains.length > 2 && (
                                                    <span className="rounded-md border border-color bg-card-color px-2 py-0.5 text-[10px] font-bold text-fill-color/70">
                                                        +{suggestedChains.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
            <NwwOneeAIChat />
        </main>
    );
}