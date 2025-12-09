import "dotenv/config";
import connectDB from "../lib/db";
import Company from "../lib/models/Company";
import Job from "../lib/models/Job";
import path from "path";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import fs from "fs";
import mongoose from "mongoose";

async function main() {
  try {
    // Validate DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error("ERROR: DATABASE_URL is not set. Please set it in your .env file");
      console.error("MongoDB connection string format: mongodb+srv://user:password@cluster.mongodb.net/database");
      process.exit(1);
    }

    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connection verified!");

    const rawFile = process.argv[2];
    if (!rawFile) {
      console.error("Usage: tsx scripts/seed.ts <file>");
      process.exit(1);
    }

    // Resolve the provided path relative to the current working directory
    // Handle Windows paths that might start with .\ or ./
    const normalizedPath = rawFile.replace(/^\.\\/, "").replace(/^\.\//, "");
    const file = path.isAbsolute(normalizedPath) 
      ? normalizedPath 
      : path.resolve(process.cwd(), normalizedPath);
    
    if (!fs.existsSync(file)) {
      console.error(`Cannot access file: ${rawFile}`);
      console.error(`Resolved path: ${file}`);
      console.error(`Current working directory: ${process.cwd()}`);
      process.exit(2);
    }

    let rows = [];

    if (file.endsWith(".csv")) {
      const csvData = fs.readFileSync(file, "utf8");
      rows = Papa.parse(csvData, { header: true }).data;
    } else if (file.endsWith(".xlsx") || file.endsWith(".xls")) {
      // Try the library's convenient readFile first; if it fails, attempt a buffer-based read
      try {
        const workbook = XLSX.readFile(file);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(sheet);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`XLSX.readFile failed: ${errorMessage}`);
        // Read raw buffer and let xlsx parse it (works better on Windows)
        const buffer = fs.readFileSync(file);
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(sheet);
      }
    } else {
      throw new Error("Unsupported file type. Use CSV or Excel.");
    }

    console.log(`Loaded ${rows.length} entries`);

    const slug = process.env.SEED_COMPANY_SLUG || "acme";

    // Find or create company
    let company = await Company.findOne({ slug });

    if (!company) {
      company = await Company.create({
        name: "Acme Corp",
        slug,
        adminKey: "acme123@",
        brandColor: "#2563eb",
        logoUrl: "",
        bannerUrl: "",
        cultureVideoUrl: "",
        sections: [],
        jobs: [],
      });
      console.log(`Created company: ${company.name}`);
    } else {
      console.log(`Found existing company: ${company.name}`);
    }

    const cleaned = rows
      .map((r) => ({
        companyId: company._id,
        title: r.title || r["Job Title"] || r["jobTitle"] || "",
        location: r.location || r["Location"] || "",
        jobType: r.jobType || r["Job Type"] || r["Type"] || "Full-time",
        description: r.description || r["Description"] || null,
      }))
      .filter((job) => job.title && job.location && job.jobType); // Filter out invalid rows

    // Insert jobs in chunks
    const chunkSize = 50;
    const jobIds: mongoose.Types.ObjectId[] = [];
    
    for (let i = 0; i < cleaned.length; i += chunkSize) {
      const chunk = cleaned.slice(i, i + chunkSize);
      const jobs = await Job.insertMany(chunk);
      jobIds.push(...jobs.map(j => j._id as unknown as mongoose.Types.ObjectId));
      console.log(`Inserted ${Math.min(i + chunkSize, cleaned.length)}/${cleaned.length}`);
    }

    // Update company with job IDs
    company.jobs = jobIds;
    await company.save();

    console.log("Seed completed successfully!");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error during seed operation:", errorMessage);
    if (errorStack) {
      console.error(errorStack);
    }
    if (errorMessage.includes("connection") || errorMessage.includes("DATABASE_URL")) {
      console.error("Please check your DATABASE_URL in .env file");
      console.error("MongoDB connection string format: mongodb+srv://user:password@cluster.mongodb.net/database");
      const dbUrl = process.env.DATABASE_URL || "NOT SET";
      console.error(`Current DATABASE_URL (first 50 chars): ${dbUrl.substring(0, 50)}...`);
    }
    throw error;
  } finally {
    await mongoose.connection.close();
  }
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });


