import { getCompanyBySlug } from "@/lib/db/company";
import { getFilteredJobs } from "@/lib/db/jobs";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const company = await getCompanyBySlug(slug);

        if (!company) {
            return new Response(JSON.stringify({
                error: "No company found!",
                status: 404
            }), { status: 404, headers: { "Content-Type": "application/json" } });
        }

        const url = new URL(req.url);
        const filters = {
            search: url.searchParams.get("search") || undefined,
            location: url.searchParams.get("location") || undefined,
            jobType: url.searchParams.get("jobType") || undefined
        };

        const jobs = await getFilteredJobs(company.id, filters);
        return new Response(JSON.stringify({
            data: jobs
        }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error: any) {
        return new Response(JSON.stringify({
            error: "Internal server error",
            message: error.message
        }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}