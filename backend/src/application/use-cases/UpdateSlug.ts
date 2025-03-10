import mongoose from "mongoose";
import { UrlRepository } from "../../infrastructure/repositories/UrlRepository.js";
import { isValidSlug } from "../helpers/slugValidator.js";

export class UpdateSlug {
  constructor(private urlRepository: UrlRepository) {
    this.urlRepository = urlRepository;
  }

  async execute(urlId: string, userId: string, newSlug: string) {
    newSlug = newSlug.trim();

    if (!isValidSlug(newSlug)) {
      throw new Error(
        "Invalid slug format. Use only letters, numbers, hyphens, and underscores.",
      );
    }

    const existingUrl = await this.urlRepository.findBySlug(newSlug);
    if (existingUrl) {
      throw new Error("Slug already taken. Choose another.");
    }

    if (!mongoose.Types.ObjectId.isValid(urlId)) {
      throw new Error("Invalid URL ID format.");
    }

    const url = await this.urlRepository.findById(urlId);
    if (!url) {
      throw new Error("URL not found.");
    }

    if (url.createdBy.toString() !== userId) {
      throw new Error("You do not have permission to update this slug.");
    }

    url.slug = newSlug;
    url.shortUrl = `${process.env.BASE_URL}/${newSlug}`;
    await this.urlRepository.update(url);

    return url;
  }
}
