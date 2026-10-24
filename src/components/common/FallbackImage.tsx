'use client';

import React, { useState } from 'react';

export const FALLBACK_IMAGE_URL = 'https://cdn.nekowawolf.xyz/image/2026/1792883843_image-unavailable.webp';

export interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fill?: boolean;
    sizes?: string;
    unoptimized?: boolean;
    priority?: boolean;
    quality?: number | string;
}

export const FallbackImage = ({ src, alt, fill, sizes, className, ...props }: FallbackImageProps) => {
    const [failedSrc, setFailedSrc] = useState<FallbackImageProps['src']>();
    const imgSrc = src && src !== failedSrc ? src : FALLBACK_IMAGE_URL;
    const nativeImageProps = { ...props };

    delete nativeImageProps.unoptimized;
    delete nativeImageProps.priority;
    delete nativeImageProps.quality;

    const combinedClassName = fill 
        ? ('absolute inset-0 w-full h-full ' + (className || '')).trim()
        : className;

    return (
        <img
            {...nativeImageProps}
            sizes={sizes}
            className={combinedClassName}
            src={imgSrc}
            alt={alt || 'Image'}
            onError={() => {
                if (src && src !== FALLBACK_IMAGE_URL) {
                    setFailedSrc(src);
                }
            }}
        />
    );
};

export const FallbackNativeImage = ({ src, alt, fill, sizes, className, ...props }: FallbackImageProps) => {
    const [failedSrc, setFailedSrc] = useState<FallbackImageProps['src']>();
    const imgSrc = src && src !== failedSrc ? src : FALLBACK_IMAGE_URL;
    const nativeImageProps = { ...props };

    delete nativeImageProps.unoptimized;
    delete nativeImageProps.priority;
    delete nativeImageProps.quality;

    const combinedClassName = fill 
        ? ('absolute inset-0 w-full h-full ' + (className || '')).trim()
        : className;

    return (
        <img
            {...nativeImageProps}
            sizes={sizes}
            className={combinedClassName}
            src={imgSrc}
            alt={alt || 'Image'}
            onError={() => {
                if (src && src !== FALLBACK_IMAGE_URL) {
                    setFailedSrc(src);
                }
            }}
        />
    );
};