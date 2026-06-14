import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center body-color text-fill-color">
      <div className="flex flex-col items-center gap-4 mt-20">
        <Spinner className="size-10 text-blue-500" />
        <p className="text-fill-color/70 animate-pulse">Loading Web3 Tools...</p>
      </div>
    </div>
  );
}
