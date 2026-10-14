'use client';

import NwwOneeAIChat from "@/components/chat/NwwOneeAIChat";
import LatestWeb3Tools from "@/components/activity/LatestWeb3Tools";
import Support from "@/components/support/Support";
import LastCommits from "@/components/activity/LastCommits";

export default function DetailClient() {
  return (
    <main className="flex-grow pt-36 pb-16 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans">
      <div className="w-full max-w-3xl mx-auto flex flex-col">
        <LatestWeb3Tools />
        <Support />
        <LastCommits />
      </div>
      <NwwOneeAIChat />
    </main>
  );
}