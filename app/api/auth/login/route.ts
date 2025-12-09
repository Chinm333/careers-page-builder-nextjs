import { getCompanyBySlug } from "@/lib/db/company";

export async function POST(req: Request) {
    try {
        const { slug, adminKey } = await req.json();
        if (!slug || !adminKey) {
            return new Response(
                JSON.stringify({
                    error: "Missing fields slug or admin key",
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const company = await getCompanyBySlug(slug);

        if (!company) {
            return new Response(
                JSON.stringify({
                    error: "Company not found",
                }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        if (company.adminKey !== adminKey) {
            return new Response(
                JSON.stringify({
                    error: "Invalid admin key",
                }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({
                token: `company-${slug}`,
                slug
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error: any) {
        return new Response(
            JSON.stringify({
                error: "Internal server error",
                message: error.message
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}