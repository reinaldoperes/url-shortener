import api from "./axiosInstance";

interface ShortenUrlResponse {
  shortUrl: string;
  slug: string;
  expiresAt?: string;
}

export const shortenUrl = async (
  originalUrl: string,
  customSlug?: string,
  expiresInDays?: number,
) => {
  const response = await api.post<ShortenUrlResponse>("/url/shorten", {
    originalUrl,
    customSlug,
    expiresInDays,
  });
  return response.data;
};

export const getUserUrls = async () => {
  const response = await api.get("/url");
  return response.data;
};

export const deleteUrl = async (urlId: string) => {
  await api.delete(`/url/${urlId}`);
};

export const updateSlug = async (urlId: string, newSlug: string) => {
  await api.put(`/url/update-slug/${urlId}`, { newSlug });
};

export const getUrlStats = async (slug: string) => {
  const response = await api.get(`/url/stats/${slug}`);
  return response.data;
};
