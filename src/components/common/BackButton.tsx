'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

interface BackButtonProps {
    fallbackUrl: string;
    label?: string;
    forceFallback?: boolean;
}

export default function BackButton({ fallbackUrl, label = "Back to List", forceFallback = false }: BackButtonProps) {
    const router = useRouter();

    if (forceFallback) {
        return (
            <Link
                href={fallbackUrl}
                className="back-control mb-8"
            >
                <FiArrowLeft aria-hidden="true" />
                {label}
            </Link>
        );
    }

    const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        router.back();
    };

    return (
        <a
            href={fallbackUrl}
            onClick={handleBack}
            className="back-control mb-8"
        >
            <FiArrowLeft aria-hidden="true" />
            {label}
        </a>
    );
}