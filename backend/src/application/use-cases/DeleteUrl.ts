import mongoose from "mongoose";
import { UrlRepository } from "../../infrastructure/repositories/UrlRepository.js";

export class DeleteUrl {
  constructor(private urlRepository: UrlRepository) {
    this.urlRepository = urlRepository;
  }

  async execute(urlId: string, userId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(urlId)) {
      throw new Error("Invalid URL ID format.");
    }

    const url = await this.urlRepository.findById(urlId);
    if (!url) {
      throw new Error("URL not found.");
    }

    if (url.createdBy.toString() !== userId) {
      throw new Error("You do not have permission to delete this URL.");
    }

    await this.urlRepository.deleteById(urlId);
  }
}
