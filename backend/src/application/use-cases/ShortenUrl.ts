import crypto from "crypto";
import { UrlRepository } from "../../infrastructure/repositories/UrlRepository.js";
import { URL } from "url";
import { isValidSlug } from "../helpers/slugValidator.js";

export class ShortenUrl {
  constructor(private urlRepository: UrlRepository) {
    this.urlRepository = urlRepository;
  }

  async execute(
    originalUrl: string,
    userId: string,
    customSlug?: string,
    expiresInDays?: number,
  ) {
    if (!this.isValidUrl(originalUrl)) {
      throw new Error("Invalid URL. Please provide a valid URL.");
    }

    let slug = customSlug?.trim();

    if (slug) {
      const existingUrl = await this.urlRepository.findBySlug(slug);
      if (existingUrl) {
        throw new Error("Slug already taken. Choose another.");
      }

      if (!isValidSlug(slug)) {
        throw new Error(
          "Invalid slug format. Use only letters, numbers, hyphens, and underscores.",
        );
      }
    } else {
      do {
        slug = crypto.randomBytes(4).toString("hex");
      } while (await this.urlRepository.findBySlug(slug));
    }

    let expiresAt: Date | undefined;
    if (expiresInDays && expiresInDays > 0) {
      expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
    }

    const newUrl = await this.urlRepository.save(
      originalUrl,
      slug,
      userId,
      expiresAt,
    );

    return {
      id: newUrl._id,
      shortUrl: newUrl.shortUrl,
      expiresAt: newUrl.expiresAt?.toISOString(),
    };
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
