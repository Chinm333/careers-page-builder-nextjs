import connectDB from "@/lib/db";
import Job from "@/lib/models/Job";
import mongoose from "mongoose";

export async function getFilteredJobs(companyId: string, filters: any) {
    try {
        await connectDB();
        const { search, location, jobType } = filters;
        
        const query: any = {
            companyId: new mongoose.Types.ObjectId(companyId)
        };
        
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }
        
        if (location) {
            query.location = location;
        }
        
        if (jobType) {
            query.jobType = jobType;
        }
        
        const jobs = await Job.find(query)
            .sort({ _id: -1 })
            .lean();
        
        return jobs.map(job => ({
            ...job,
            id: job._id.toString(),
            description: job.description ?? null
        }));
    } catch (error) {
        console.error("Error in getFilteredJobs:", error);
        return [];
    }
}