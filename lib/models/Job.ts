import mongoose, { Schema, Model } from "mongoose";

export interface IJob {
  _id: string;
  companyId: mongoose.Types.ObjectId;
  title: string;
  location: string;
  jobType: string;
  description?: string;
}

const JobSchema = new Schema<IJob>({
  companyId: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
  title: { type: String, required: true },
  location: { type: String, required: true },
  jobType: { type: String, required: true },
  description: { type: String },
});

const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);

export default Job;



