export interface AddedByInfo {
    name: string;
    url?: string;
}

export interface Web3ToolMedia {
    video_url?: string;
    screenshot_urls?: string[];
}

export interface Web3Tool {
    _id: string;
    name: string;
    description: string;
    categories: string[];
    chains: string[];
    image_url: string;
    website?: string;
    media?: Web3ToolMedia;
    added_by?: AddedByInfo;
    twitter?: string;
    instagram?: string;
    discord?: string;
    youtube?: string;
    telegram?: string;
    created_at?: string;
}

export interface Web3ToolSubmissionPayload {
    website: string;
    name: string;
    link?: string;
    turnstile_token: string;
}