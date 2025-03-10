import mongoose, { Schema, Document } from "mongoose";

export interface IUrl extends Document {
  originalUrl: string;
  shortUrl: string;
  slug: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  clicks: number;
}

const UrlSchema = new Schema<IUrl>({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, required: true, default: 0 },
});

export default mongoose.model<IUrl>("Url", UrlSchema);
