import connectDB from "@/lib/db";
import Company from "@/lib/models/Company";
import Section from "@/lib/models/Section";
import mongoose from "mongoose";

export async function getCompanyConfig(slug: string) {
    try {
        await connectDB();
        const company = await Company.findOne({ slug }).lean();

        if (!company) return null;

        const sectionIds = company.sections || [];
        const sections = await Section.find({ _id: { $in: sectionIds } })
            .sort({ order: 1 })
            .lean();

        const formattedSections = sections.map((section: any) => ({
            ...section,
            id: section._id.toString()
        }));

        return {
            ...company,
            id: company._id.toString(),
            sections: formattedSections
        };
    } catch (error) {
        console.error("Error in getCompanyConfig:", error);
        throw error;
    }
}

export async function updateCompanyBrand(slug: string, data: any) {
    try {
        await connectDB();
        let brandColor = data.brandColor || "#2563eb";
        if (brandColor && !brandColor.startsWith("#")) {
            brandColor = "#" + brandColor;
        }

        const company = await Company.findOneAndUpdate(
            { slug },
            {
                name: data.name,
                logoUrl: data.logoUrl || "",
                bannerUrl: data.bannerUrl || "",
                brandColor: brandColor,
                cultureVideoUrl: data.cultureVideoUrl || ""
            },
            { new: true }
        );

        if (!company) {
            throw new Error("Company not found!");
        }

        return company;
    } catch (error) {
        console.error("Error in updateCompanyBrand:", error);
        throw error;
    }
}

export async function replaceCompanySections(slug: string, sections: any[]) {
    try {
        await connectDB();
        const company = await Company.findOne({ slug });
        if (!company) {
            throw new Error("Company not found!");
        }
        await Section.deleteMany({ companyId: company._id });

        if (!sections.length) {
            company.sections = [];
            await company.save();
            return;
        }
        const sectionDocs = sections.map((s) => ({
            companyId: company._id,
            type: s.type,
            title: s.title,
            content: s.content,
            order: s.order
        }));

        const createdSections = await Section.insertMany(sectionDocs);
        company.sections = createdSections.map(s => s._id as unknown as mongoose.Types.ObjectId);
        await company.save();
    } catch (error) {
        console.error("Error in replaceCompanySections:", error);
        throw error;
    }
}

export async function getCompanyBySlug(slug: string) {
    try {
        await connectDB();
        const company = await Company.findOne({ slug }).lean();
        if (!company) return null;
        return {
            ...company,
            id: company._id.toString()
        };
    } catch (error) {
        console.error("Error in getCompanyBySlug:", error);
        return null;
    }
}