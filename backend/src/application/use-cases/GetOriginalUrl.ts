import UrlModel from "../../infrastructure/database/models/UrlModel.js";

export class GetOriginalUrl {
  async execute(slug: string): Promise<string | null> {
    const url = await UrlModel.findOne({ slug });

    if (!url) {
      return null;
    }

    url.clicks += 1;
    await url.save();

    return url.originalUrl;
  }
}
