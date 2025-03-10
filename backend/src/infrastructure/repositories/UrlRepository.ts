import UrlModel, { IUrl } from "../database/models/UrlModel.js";

export class UrlRepository {
  async save(originalUrl: string, slug: string, userId: string): Promise<IUrl> {
    const shortUrl = `${process.env.BASE_URL}/${slug}`;
    return UrlModel.create({ originalUrl, slug, shortUrl, createdBy: userId });
  }

  async findBySlug(slug: string): Promise<IUrl | null> {
    return UrlModel.findOne({ slug }).exec();
  }
}
