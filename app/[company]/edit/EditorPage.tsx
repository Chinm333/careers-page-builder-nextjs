"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandForm } from "@/components/BrandForm";
import {
    SectionsEditor,
    EditableSection
} from "@/components/SectionsEditor";

type CompanyState = {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    bannerUrl: string | null;
    brandColor: string | null;
    cultureVideoUrl: string | null;
};

type Props = {
    slug: string;
    initialConfig: {
        company: CompanyState;
        sections: EditableSection[];
    };
};

export default function EditorPage({ slug, initialConfig }: Props) {
    const [company, setCompany] = useState<CompanyState>(
        initialConfig.company
    );
    const [sections, setSections] =
        useState<EditableSection[]>(initialConfig.sections);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function handleSave() {
        setSaving(true);
        setMessage(null);
        try {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("recruiterToken")
                    : null;
            if (!token || !token.startsWith(`company-${slug}`)) {
                setMessage("Not authenticated. Please log in again.");
                setSaving(false);
                return;
            }

            const res = await fetch(`/api/companies/${slug}/config`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    company: {
                        name: company.name,
                        logoUrl: company.logoUrl,
                        bannerUrl: company.bannerUrl,
                        brandColor: company.brandColor,
                        cultureVideoUrl: company.cultureVideoUrl
                    },
                    sections
                })
            });

            if (!res.ok) {
                setMessage("Failed to save changes.");
            } else {
                setMessage("Saved successfully.");
            }
        } catch {
            setMessage("Unexpected error.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <div className="flex items-center justify-between gap-2">
                <h1 className="text-xl font-semibold">
                    Edit Careers Page – {company.name}
                </h1>
                <div className="flex gap-2 text-sm">
                    <Link
                        href={`/${slug}/preview`}
                        className="rounded border px-3 py-1"
                    >
                        Preview
                    </Link>
                    <Link
                        href={`/${slug}/careers`}
                        className="rounded border px-3 py-1"
                    >
                        Public Careers Page
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <BrandForm
                    initial={{
                        name: company.name,
                        logoUrl: company.logoUrl,
                        bannerUrl: company.bannerUrl,
                        brandColor: company.brandColor,
                        cultureVideoUrl: company.cultureVideoUrl
                    }}
                    onChange={(v) =>
                        setCompany((c) => ({
                            ...c,
                            name: v.name,
                            logoUrl: v.logoUrl,
                            bannerUrl: v.bannerUrl,
                            brandColor: v.brandColor,
                            cultureVideoUrl: v.cultureVideoUrl
                        }))
                    }
                />
                <SectionsEditor
                    initial={sections}
                    onChange={(s: any) => setSections(s)}
                />
            </div>

            <div className="mt-4 flex items-center justify-between">
                {message && <p className="text-xs text-gray-600">{message}</p>}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </>
    );
}