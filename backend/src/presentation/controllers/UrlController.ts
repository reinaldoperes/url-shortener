import { Request, Response } from "express";
import { DeleteUrl } from "../../application/use-cases/DeleteUrl.js";
import { GetOriginalUrl } from "../../application/use-cases/GetOriginalUrl.js";
import { GetUrlStats } from "../../application/use-cases/GetUrlStats.js";
import { ListUserUrls } from "../../application/use-cases/ListUserUrls.js";
import { UpdateSlug } from "../../application/use-cases/UpdateSlug.js";
import { UrlRepository } from "../../infrastructure/repositories/UrlRepository.js";
import { ShortenUrl } from "../../application/use-cases/ShortenUrl.js";
import {
  serializeJsonApi,
  serializeError,
} from "../../utils/jsonApiSerializer.js";

const urlRepository = new UrlRepository();
const deleteUrl = new DeleteUrl(urlRepository);
const getOriginalUrl = new GetOriginalUrl();
const getUrlStats = new GetUrlStats();
const listUserUrls = new ListUserUrls(urlRepository);
const shortenUrl = new ShortenUrl(urlRepository);
const updateSlug = new UpdateSlug(urlRepository);

export class UrlController {
  static async shorten(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json(serializeError(401, "Unauthorized"));
      }

      const { originalUrl, customSlug, expiresInDays } = req.body;

      if (!originalUrl) {
        return res
          .status(400)
          .json(serializeError(400, "Original URL is required"));
      }

      let expires = undefined;
      if (expiresInDays !== undefined) {
        const parsedExpires = Number(expiresInDays);
        if (isNaN(parsedExpires) || parsedExpires <= 0) {
          return res
            .status(400)
            .json(
              serializeError(
                400,
                "Invalid expiration time. Must be a positive number.",
              ),
            );
        }
        expires = parsedExpires;
      }

      const result = await shortenUrl.execute(
        originalUrl,
        req.user.id,
        customSlug,
        expires,
      );
      return res.status(201).json(serializeJsonApi("urls", result));
    } catch {
      return res
        .status(500)
        .json(serializeError(500, "An unexpected error occurred"));
    }
  }

  static async redirect(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const result = await getOriginalUrl.execute(slug);

      if (!result.success) {
        const errorMessage =
          result.error === "URL has expired"
            ? "URL has expired"
            : "URL not found";
        const statusCode = result.error === "URL has expired" ? 410 : 404;
        return res
          .status(statusCode)
          .json(serializeError(statusCode, errorMessage));
      }

      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      return res.redirect(301, result.originalUrl!);
    } catch {
      return res.status(500).json(serializeError(500, "Internal server error"));
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const stats = await getUrlStats.execute(slug);

      if (!stats) {
        return res.status(404).json(serializeError(404, "URL not found"));
      }

      return res.json(serializeJsonApi("url-stats", stats));
    } catch {
      return res.status(500).json(serializeError(500, "Internal server error"));
    }
  }

  static async updateSlug(req: Request, res: Response) {
    try {
      const { urlId } = req.params;
      const { newSlug } = req.body;

      if (!newSlug) {
        return res
          .status(400)
          .json(serializeError(400, "New slug is required."));
      }

      const updatedUrl = await updateSlug.execute(
        urlId,
        req.user?.id!,
        newSlug,
      );
      return res.json(serializeJsonApi("urls", updatedUrl));
    } catch (error) {
      return res
        .status(400)
        .json(
          serializeError(
            400,
            "Failed to update slug",
            error instanceof Error ? error.message : "Unknown error",
          ),
        );
    }
  }

  static async deleteUrl(req: Request, res: Response) {
    try {
      const { urlId } = req.params;

      if (!req.user) {
        return res.status(401).json(serializeError(401, "Unauthorized access"));
      }

      await deleteUrl.execute(urlId, req.user.id);
      return res.json(
        serializeJsonApi("urls", { message: "URL deleted successfully." }),
      );
    } catch (error) {
      return res
        .status(400)
        .json(
          serializeError(
            400,
            "Failed to delete URL",
            error instanceof Error ? error.message : "Unknown error",
          ),
        );
    }
  }

  static async listUserUrls(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json(serializeError(401, "Unauthorized access"));
      }

      const urls = await listUserUrls.execute(req.user.id);
      return res.json(serializeJsonApi("urls", urls));
    } catch {
      return res
        .status(500)
        .json(serializeError(500, "An unexpected error occurred"));
    }
  }
}
