import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/tenant",
    name: "PlazaHub Tenant",
    short_name: "PlazaHub",
    description: "The mobile-first PlazaHub tenant preview. Account features are not available yet.",
    lang: "en-NG",
    start_url: "/tenant",
    scope: "/tenant",
    display: "standalone",
    background_color: "#f7f9fa",
    theme_color: "#142c40",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
