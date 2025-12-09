import { Metadata } from "next";
import { getCompanyConfig } from "@/lib/db/company";
import { getFilteredJobs } from "@/lib/db/jobs";
import { JobsList } from "@/components/JobsList";
import { JobFilters } from "@/components/JobFilters";

type Props = {
    params: Promise<{ company: string }>;
    searchParams: Promise<{
        search?: string;
        location?: string;
        job_type?: string;
    }>;
};

export async function generateMetadata({
    params
}: {
    params: Promise<{ company: string }>;
}): Promise<Metadata> {
    const { company } = await params;
    const config = await getCompanyConfig(company);
    if (!config) {
        return {
            title: "Careers",
            description: "Explore open roles."
        };
    }
    return {
        title: `Careers at ${config.name}`,
        description: `Explore jobs at ${config.name}. Join our team and help us build the future.`,
        openGraph: {
            title: `Careers at ${config.name}`,
            description: `Explore jobs at ${config.name}. Join our team and help us build the future.`,
            type: "website",
        },
        twitter: {
            card: "summary",
            title: `Careers at ${config.name}`,
            description: `Explore jobs at ${config.name}. Join our team and help us build the future.`,
        }
    };
}

export default async function CareersPage({ params, searchParams }: Props) {
    const { company } = await params;
    const resolvedSearchParams = await searchParams;
    
    let config;
    try {
        config = await getCompanyConfig(company);
    } catch (error) {
        console.error("Error loading company config:", error);
        return (
            <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
                <p className="text-sm text-red-600">Error loading company data. Please try again later.</p>
            </main>
        );
    }
    
    if (!config) {
        return (
            <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
                <p className="text-sm text-gray-600">Company not found.</p>
            </main>
        );
    }

    const jobs = await getFilteredJobs(config.id, {
        search: resolvedSearchParams.search,
        location: resolvedSearchParams.location,
        jobType: resolvedSearchParams.job_type
    });

    // Normalize brand color to always have # prefix
    let brandColor = config.brandColor || "#2563eb";
    if (brandColor && !brandColor.startsWith("#")) {
        brandColor = "#" + brandColor;
    }

    const uniqueLocations = Array.from(
        new Set(jobs.map((j: any) => j.location))
    ).filter(Boolean);
    const uniqueTypes = Array.from(
        new Set(jobs.map((j: any) => j.jobType))
    ).filter(Boolean);

    // Generate structured data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": config.name,
        "logo": config.logoUrl || "",
        "jobPosting": jobs.map((job: any) => ({
            "@type": "JobPosting",
            "title": job.title,
            "description": job.description || "",
            "employmentType": job.jobType,
            "jobLocation": {
                "@type": "Place",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": job.location
                }
            }
        }))
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <div
                className="h-32 w-full"
                style={{ backgroundColor: brandColor }}
                role="banner"
            />
            <main className="mx-auto max-w-4xl px-4 pb-10" role="main">
                <div className="-mt-8 flex flex-wrap items-end gap-3">
                    {config.logoUrl && (
                        <img
                            src={config.logoUrl}
                            alt={`${config.name} logo`}
                            className="h-16 w-16 rounded bg-white object-contain p-2 shadow"
                        />
                    )}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-white drop-shadow-sm">
                            Careers at {config.name}
                        </h1>
                        {config.cultureVideoUrl && (
                            <a
                                href={config.cultureVideoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-1 inline-block text-sm text-white underline opacity-90 hover:opacity-100"
                                aria-label="Watch our culture video"
                            >
                                Watch culture video
                            </a>
                        )}
                    </div>
                </div>

                <div className="mt-8 space-y-6">
                    {config.sections.map((section: any) => (
                        <section
                            key={section.id}
                            className="space-y-1 rounded bg-white p-4 shadow-sm"
                            aria-labelledby={`section-${section.id}`}
                        >
                            <h2 id={`section-${section.id}`} className="text-lg font-semibold">
                                {section.title}
                            </h2>
                            <p className="whitespace-pre-line text-sm text-gray-700">
                                {section.content}
                            </p>
                        </section>
                    ))}
                </div>

                <section className="mt-8">
                    <h2 className="text-lg font-semibold">Open Roles</h2>

                    <JobFilters
                        search={resolvedSearchParams.search}
                        location={resolvedSearchParams.location}
                        job_type={resolvedSearchParams.job_type}
                        uniqueLocations={uniqueLocations}
                        uniqueTypes={uniqueTypes}
                    />

                    <div className="mt-4">
                        <JobsList jobs={jobs} />
                    </div>
                </section>
            </main>
        </div>
    );
}