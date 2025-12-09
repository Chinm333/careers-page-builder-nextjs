"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [slug, setSlug] = useState("acme");
    const [adminKey, setAdminKey] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, adminKey })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Login failed");
            } else {
                if (typeof window !== "undefined") {
                    localStorage.setItem("recruiterToken", data.token);
                }
                router.push(`/${data.slug}/edit`);
            }
        } catch {
            setError("Unexpected error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 rounded-lg border bg-white p-6 shadow-sm"
                >
                    <h1 className="text-xl font-semibold">Recruiter Login</h1>
                    <p className="text-xs text-gray-500">
                        Use your company slug and admin key.
                    </p>
                    <p className="text-xs text-gray-400 italic">
                        Demo: slug: "acme", adminKey: "acme123@"
                    </p>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Company Slug</label>
                        <input
                            className="w-full rounded border px-2 py-1 text-sm"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Admin Key</label>
                        <input
                            type="password"
                            className="w-full rounded border px-2 py-1 text-sm"
                            value={adminKey}
                            onChange={(e) => setAdminKey(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-xs text-red-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </main>
        </div>
    );
}