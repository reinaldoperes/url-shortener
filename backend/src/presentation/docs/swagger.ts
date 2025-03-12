import { serve, setup } from "swagger-ui-express";
import express from "express";

const router = express.Router();

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "URL Shortener API",
    version: "1.0.0",
    description: "API for creating and managing short URLs",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local server",
    },
  ],
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register a new user",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "user@example.com" },
                  password: { type: "string", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "User registered successfully" },
          "400": { description: "Invalid request data" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Login user",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "user@example.com" },
                  password: { type: "string", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User authenticated successfully",
            content: {
              "application/json": {
                schema: { type: "object", properties: { token: { type: "string" } } },
              },
            },
          },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/api/url/shorten": {
      post: {
        summary: "Create a short URL",
        tags: ["URLs"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  originalUrl: { type: "string", example: "https://example.com" },
                  customSlug: { type: "string", example: "my-custom-url" },
                  expiresInDays: { type: "integer", example: 7 },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Short URL created" },
          "400": { description: "Invalid request data" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/url/{slug}": {
      get: {
        summary: "Redirect to original URL",
        tags: ["URLs"],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "abc123",
          },
        ],
        responses: {
          "301": { description: "Redirect to original URL" },
          "404": { description: "URL not found" },
          "410": { description: "URL expired" },
        },
      },
    },
    "/api/url/stats/{slug}": {
      get: {
        summary: "Get statistics of a shortened URL",
        tags: ["URLs"],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "abc123",
          },
        ],
        responses: {
          "200": {
            description: "URL statistics",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    slug: { type: "string" },
                    clicks: { type: "integer" },
                    createdAt: { type: "string", format: "date-time" },
                    expiresAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          "404": { description: "URL not found" },
        },
      },
    },
    "/api/url/update-slug/{urlId}": {
      put: {
        summary: "Update the slug of a short URL",
        tags: ["URLs"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "urlId",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "65d1aefb12c34e000b000123",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  newSlug: { type: "string", example: "new-custom-url" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Slug updated successfully" },
          "400": { description: "Invalid request data" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/url/{urlId}": {
      delete: {
        summary: "Delete a short URL",
        tags: ["URLs"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "urlId",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "65d1aefb12c34e000b000123",
          },
        ],
        responses: {
          "200": { description: "URL deleted successfully" },
          "401": { description: "Unauthorized" },
          "404": { description: "URL not found" },
        },
      },
    },
    "/api/url/": {
      get: {
        summary: "List all short URLs created by the authenticated user",
        tags: ["URLs"],
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "List of user-created URLs",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      shortUrl: { type: "string" },
                      originalUrl: { type: "string" },
                      slug: { type: "string" },
                      clicks: { type: "integer" },
                      expiresAt: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
  },
};

router.use("/docs", serve, setup(swaggerDocument));

export { router as swaggerDocs };
