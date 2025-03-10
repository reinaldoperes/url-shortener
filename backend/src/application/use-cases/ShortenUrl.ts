import crypto from "crypto";
import { UrlRepository } from "../../infrastructure/repositories/UrlRepository.js";

export class ShortenUrl {
  constructor(private urlRepository: UrlRepository) {
    this.urlRepository = urlRepository;
  }

  async execute(originalUrl: string, userId: string, customSlug?: string) {
    let slug = customSlug;

    if (!slug) {
      slug = crypto.randomBytes(4).toString("hex");
    }

    const existingUrl = await this.urlRepository.findBySlug(slug);
    if (existingUrl) {
      throw new Error("Slug already taken. Choose another.");
    }

    return await this.urlRepository.save(originalUrl, slug, userId);
  }
}
