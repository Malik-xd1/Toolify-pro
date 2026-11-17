import { MetadataRoute } from "next";
import { TOOLS } from "@/data/toolsData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://toolifypro.com";
  const now = new Date();

  const toolUrls: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${baseUrl}/tools/${tool.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    ...toolUrls,
  ];
}
