import mongoose, { Schema, Model } from "mongoose";

export interface ICompany {
  _id: string;
  name: string;
  slug: string;
  logoUrl: string;
  bannerUrl: string;
  brandColor: string;
  cultureVideoUrl: string;
  adminKey: string;
  sections: mongoose.Types.ObjectId[];
  jobs: mongoose.Types.ObjectId[];
}

const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  logoUrl: { type: String, default: "" },
  bannerUrl: { type: String, default: "" },
  brandColor: { type: String, required: true, default: "#2563eb" },
  cultureVideoUrl: { type: String, default: "" },
  adminKey: { type: String, required: true },
  sections: [{ type: Schema.Types.ObjectId, ref: "Section" }],
  jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
});

const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);

export default Company;


