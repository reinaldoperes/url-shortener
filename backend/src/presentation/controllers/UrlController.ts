import { Request, Response } from "express";
import { DeleteUrl } from "../../application/use-cases/DeleteUrl.js";
import { UpdateSlug } from "../../application/use-cases/UpdateSlug.js";
import { UrlRepository } from "../../infrastructure/repositories/UrlRepository.js";
import { ShortenUrl } from "../../application/use-cases/ShortenUrl.js";
import { GetOriginalUrl } from "../../application/use-cases/GetOriginalUrl.js";
import { GetUrlStats } from "../../application/use-cases/GetUrlStats.js";

const urlRepository = new UrlRepository();
const deleteUrl = new DeleteUrl(urlRepository);
const shortenUrl = new ShortenUrl(urlRepository);
const getOriginalUrl = new GetOriginalUrl();
const getUrlStats = new GetUrlStats();
const updateSlug = new UpdateSlug(urlRepository);

export class UrlController {
  static async shorten(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { originalUrl, customSlug } = req.body;

      if (!originalUrl) {
        return res.status(400).json({ error: "Original URL is required" });
      }

      const result = await shortenUrl.execute(
        originalUrl,
        req.user.id,
        customSlug,
      );
      return res.status(201).json(result);
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

  static async updateSlug(req: Request, res: Response) {
    try {
      const { urlId } = req.params;
      const { newSlug } = req.body;

      if (!newSlug) {
        return res.status(400).json({ error: "New slug is required." });
      }

      const updatedUrl = await updateSlug.execute(
        urlId,
        req.user?.id!,
        newSlug,
      );
      return res.json({ message: "Slug updated successfully", updatedUrl });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }

  static async deleteUrl(req: Request, res: Response) {
    try {
      const { urlId } = req.params;

      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized access" });
      }

      await deleteUrl.execute(urlId, req.user.id);
      return res.json({ message: "URL deleted successfully." });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
}
