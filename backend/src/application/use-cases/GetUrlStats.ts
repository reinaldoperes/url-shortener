import UrlModel from "../../infrastructure/database/models/UrlModel.js";

export class GetUrlStats {
  async execute(slug: string): Promise<{ clicks: number } | null> {
    const url = await UrlModel.findOne({ slug });

    if (!url) {
      return null;
    }

    return { clicks: url.clicks };
  }
}
