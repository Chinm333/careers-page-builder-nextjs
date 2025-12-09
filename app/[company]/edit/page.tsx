import { getCompanyConfig } from "@/lib/db/company";
import EditorPage from "./EditorPage";

export default async function EditPage({
    params
}: {
    params: Promise<{ company: string }>;
}) {
    const { company } = await params;
    const config = await getCompanyConfig(company);

    if (!config) {
        return (
            <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
                <p className="text-sm text-gray-600">Company not found.</p>
            </main>
        );
    }

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-4 px-4 py-6">
            <EditorPage
                slug={company}
                initialConfig={{
                    company: {
                        id: config.id,
                        name: config.name,
                        slug: config.slug,
                        logoUrl: config.logoUrl,
                        bannerUrl: config.bannerUrl,
                        brandColor: config.brandColor,
                        cultureVideoUrl: config.cultureVideoUrl
                    },
                    sections: config.sections.map((s: any) => ({
                        type: s.type,
                        title: s.title,
                        content: s.content,
                        order: s.order
                    }))
                }}
            />
        </main>
    );
}