import api from "./axiosInstance";

interface ApiResponse<T> {
  data: {
    type: string;
    id: string;
    attributes: T;
  };
}

interface ApiListResponse<T> {
  data: {
    type: string;
    id: string;
    attributes: T;
  }[];
}

interface ShortenUrlResponse {
  shortUrl: string;
  slug: string;
  expiresAt?: string;
}

interface UrlAttributes {
  shortUrl: string;
  originalUrl: string;
  slug: string;
  clicks: number;
}

export const shortenUrl = async (
  originalUrl: string,
  customSlug?: string,
  expiresInDays?: number,
) => {
  const response = await api.post<ApiResponse<ShortenUrlResponse>>(
    "/url/shorten",
    {
      originalUrl,
      customSlug,
      expiresInDays,
    },
  );
  return response.data.data.attributes;
};

export const getUserUrls = async () => {
  const response = await api.get<ApiListResponse<UrlAttributes>>("/url");
  return response.data.data.map((item) => ({
    id: item.id,
    ...item.attributes,
  }));
};

export const deleteUrl = async (urlId: string) => {
  await api.delete(`/url/${urlId}`);
};

export const updateSlug = async (urlId: string, newSlug: string) => {
  await api.put(`/url/update-slug/${urlId}`, { newSlug });
};

export const getUrlStats = async (slug: string) => {
  const response = await api.get<ApiResponse<{ clicks: number }>>(
    `/url/stats/${slug}`,
  );
  return response.data.data.attributes;
};
