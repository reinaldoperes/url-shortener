import UrlModel from "../../infrastructure/database/models/UrlModel.js";
import { IGetOriginalUrlResult } from "../dtos/GetOriginalUrlResult.js";

export class GetOriginalUrl {
  async execute(slug: string): Promise<IGetOriginalUrlResult> {
    const url = await UrlModel.findOne({ slug });

    if (!url) {
      return { success: false, error: "URL not found" };
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      return { success: false, error: "URL has expired" };
    }

    url.clicks += 1;
    await url.save();

    return { success: true, originalUrl: url.originalUrl };
  }
}
