import { Request, Response } from "express";
import { UrlRepository } from "../../infrastructure/repositories/UrlRepository.js";
import { ShortenUrl } from "../../application/use-cases/ShortenUrl.js";
import { GetOriginalUrl } from "../../application/use-cases/GetOriginalUrl.js";
import { GetUrlStats } from "../../application/use-cases/GetUrlStats.js";

const urlRepository = new UrlRepository();
const shortenUrl = new ShortenUrl(urlRepository);
const getOriginalUrl = new GetOriginalUrl();
const getUrlStats = new GetUrlStats();

export class UrlController {
  static async shorten(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { originalUrl, slug } = req.body;

      if (!originalUrl) {
        return res.status(400).json({ error: "Original URL is required" });
      }

      const newUrl = await shortenUrl.execute(originalUrl, req.user.id, slug);
      return res.status(201).json({ shortUrl: newUrl.shortUrl });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }

  static async redirect(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const originalUrl = await getOriginalUrl.execute(slug);

      if (!originalUrl) {
        return res.status(404).json({ error: "URL not found" });
      }

      return res.redirect(301, originalUrl);
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const stats = await getUrlStats.execute(slug);

      if (!stats) {
        return res.status(404).json({ error: "URL not found" });
      }

      return res.json(stats);
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
