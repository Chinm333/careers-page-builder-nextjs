import { getCompanyConfig, updateCompanyBrand, replaceCompanySections } from "@/lib/db/company";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const config = await getCompanyConfig(slug);
        if (!config) {
            return new Response(
                JSON.stringify({
                    error: "Config not found!",
                }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }
        return new Response(
            JSON.stringify({
                data: config
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

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const body = await req.json();
        const { company: companyData, sections } = body;
        
        if (!companyData || !sections) {
            return new Response(
                JSON.stringify({
                    error: "Missing required fields"
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
        
        // Verify company exists before updating
        const existingCompany = await getCompanyConfig(slug);
        if (!existingCompany) {
            return new Response(
                JSON.stringify({
                    error: "Company not found"
                }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }
        
        await updateCompanyBrand(slug, companyData);
        await replaceCompanySections(slug, sections);
        const updated = await getCompanyConfig(slug);
        
        return new Response(
            JSON.stringify({
                data: updated
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error: any) {
        return new Response(
            JSON.stringify({
                error: "Failed to update config",
                message: error.message
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}