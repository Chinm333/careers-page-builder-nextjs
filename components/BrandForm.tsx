"use client";

import { useState } from "react";

type BrandState = {
    name: string;
    logoUrl: string | null;
    bannerUrl: string | null;
    brandColor: string | null;
    cultureVideoUrl: string | null;
};

type Props = {
    initial: BrandState;
    onChange: (value: BrandState) => void;
};

export function BrandForm({ initial, onChange }: Props) {
    const [state, setState] = useState<BrandState>(initial);

    function update<K extends keyof BrandState>(key: K, value: BrandState[K]) {
        const next = { ...state, [key]: value };
        setState(next);
        onChange(next);
    }

    return (
        <div className="space-y-4 rounded-lg border bg-white p-4">
            <h2 className="text-lg font-semibold">Brand Theme</h2>
            <div className="space-y-1">
                <label htmlFor="company-name" className="text-sm font-medium">
                    Company Name
                </label>
                <input
                    id="company-name"
                    type="text"
                    className="w-full rounded border px-2 py-1 text-sm"
                    value={state.name}
                    onChange={(e) => update("name", e.target.value)}
                    required
                    aria-required="true"
                />
            </div>
            <div className="space-y-1">
                <label htmlFor="logo-url" className="text-sm font-medium">
                    Logo URL
                </label>
                <input
                    id="logo-url"
                    type="url"
                    className="w-full rounded border px-2 py-1 text-sm"
                    value={state.logoUrl ?? ""}
                    onChange={(e) => update("logoUrl", e.target.value || null)}
                    placeholder="https://example.com/logo.png"
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="banner-url" className="text-sm font-medium">
                    Banner URL
                </label>
                <input
                    id="banner-url"
                    type="url"
                    className="w-full rounded border px-2 py-1 text-sm"
                    value={state.bannerUrl ?? ""}
                    onChange={(e) => update("bannerUrl", e.target.value || null)}
                    placeholder="https://example.com/banner.png"
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="brand-color" className="text-sm font-medium">
                    Brand Color (hex)
                </label>
                <input
                    id="brand-color"
                    type="text"
                    className="w-full rounded border px-2 py-1 text-sm"
                    value={state.brandColor ?? ""}
                    onChange={(e) => update("brandColor", e.target.value || null)}
                    placeholder="#2563eb"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="culture-video-url" className="text-sm font-medium">
                    Culture Video URL
                </label>
                <input
                    id="culture-video-url"
                    type="url"
                    className="w-full rounded border px-2 py-1 text-sm"
                    value={state.cultureVideoUrl ?? ""}
                    onChange={(e) => update("cultureVideoUrl", e.target.value || null)}
                    placeholder="https://youtube.com/watch?v=..."
                />
            </div>
        </div>
    )
}