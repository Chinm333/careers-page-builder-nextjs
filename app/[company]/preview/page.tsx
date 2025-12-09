import { getCompanyConfig } from "@/lib/db/company";
import { getFilteredJobs } from "@/lib/db/jobs";
import { JobsList } from "@/components/JobsList";

export default async function PreviewPage({
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

    const jobs = await getFilteredJobs(config.id, {});
    // Normalize brand color to always have # prefix
    let brandColor = config.brandColor || "#2563eb";
    if (brandColor && !brandColor.startsWith("#")) {
        brandColor = "#" + brandColor;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div
                className="h-32 w-full"
                style={{ backgroundColor: brandColor }}
            />
            <main className="mx-auto max-w-4xl px-4 pb-10">
                <p className="mt-3 text-xs font-semibold uppercase text-gray-500">
                    Preview
                </p>
                <h1 className="mt-1 text-2xl font-bold">
                    Careers at {config.name}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                    {config.logoUrl && (
                        <img
                            src={config.logoUrl}
                            alt={`${config.name} logo`}
                            className="h-12 w-12 rounded bg-white object-contain p-1"
                        />
                    )}
                    {config.cultureVideoUrl && (
                        <a
                            href={config.cultureVideoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-blue-700 underline"
                        >
                            Watch culture video
                        </a>
                    )}
                </div>

                <div className="mt-6 space-y-6">
                    {config.sections.map((section: any) => (
                        <section key={section.id} className="space-y-1">
                            <h2 className="text-lg font-semibold">{section.title}</h2>
                            <p className="whitespace-pre-line text-sm text-gray-700">
                                {section.content}
                            </p>
                        </section>
                    ))}
                </div>

                <div className="mt-8">
                    <h2 className="text-lg font-semibold">Open Roles</h2>
                    <div className="mt-3">
                        <JobsList jobs={jobs} />
                    </div>
                </div>
            </main>
        </div>
    );
}