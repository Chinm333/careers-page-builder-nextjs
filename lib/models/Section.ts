import mongoose, { Schema, Model } from "mongoose";

export interface ISection {
  _id: string;
  companyId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  content: string;
  order: number;
}

const SectionSchema = new Schema<ISection>({
  companyId: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
  type: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  order: { type: Number, required: true },
});

const Section: Model<ISection> = mongoose.models.Section || mongoose.model<ISection>("Section", SectionSchema);

export default Section;



