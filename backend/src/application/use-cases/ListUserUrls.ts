import { UrlRepository } from "../../infrastructure/repositories/UrlRepository.js";

export class ListUserUrls {
  constructor(private urlRepository: UrlRepository) {
    this.urlRepository = urlRepository;
  }

  async execute(userId: string) {
    return await this.urlRepository.findAllByUserId(userId);
  }
}
