import crypto from "crypto";
import { UrlRepository } from "../../infrastructure/repositories/UrlRepository.js";
import { URL } from "url";

export class ShortenUrl {
  constructor(private urlRepository: UrlRepository) {
    this.urlRepository = urlRepository;
  }

  async execute(originalUrl: string, userId: string, customSlug?: string) {
    if (!this.isValidUrl(originalUrl)) {
      throw new Error("Invalid URL. Please provide a valid URL.");
    }

    let slug = customSlug;

    if (!slug) {
      do {
        slug = crypto.randomBytes(4).toString("hex");
      } while (await this.urlRepository.findBySlug(slug));
    } else {
      const existingUrl = await this.urlRepository.findBySlug(slug);
      if (existingUrl) {
        throw new Error("Slug already taken. Choose another.");
      }
    }

    return await this.urlRepository.save(originalUrl, slug, userId);
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
