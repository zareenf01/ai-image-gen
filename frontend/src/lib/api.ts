import axios from "axios";

const API_URL: string | undefined = import.meta.env.VITE_API_URL;
const IMG_URL: string | undefined =
  import.meta.env.VITE_IMG_URL ??
  API_URL?.replace(/generate-content\/?$/, "images");

export interface GalleryImage {
  id: string;
  prompt: string;
  src: string;
  createdAt?: string;
}

interface RawImage {
  id: string;
  prompt: string;
  imageData: string;
  createdAt?: string;
}

function apiOrigin() {
  try {
    return new URL(IMG_URL ?? API_URL ?? "").origin;
  } catch {
    return "";
  }
}

export function toSrc(imageData: string) {
  if (imageData.startsWith("data:")) return imageData;
  if (imageData.startsWith("iVBOR")) return `data:image/png;base64,${imageData}`;
  if (imageData.startsWith("/9j")) return `data:image/jpeg;base64,${imageData}`;
  if (imageData.startsWith("/")) return `${apiOrigin()}${imageData}`;
  return `data:image/jpeg;base64,${imageData}`;
}

const BLOCKED =
  /\b(jizz|shit\w*|fuck\w*|porn\w*|nude|naked|sex\w*|joint|weed|bitch\w*|dick|cock|pussy|boobs?|nsfw)\b/i;

export function isClean(prompt: string) {
  return !BLOCKED.test(prompt);
}

export function tidyPrompt(prompt: string) {
  const p = prompt.trim().replace(/\s+/g, " ");
  return p.charAt(0).toUpperCase() + p.slice(1);
}

export async function generateImage(prompt: string, signal?: AbortSignal) {
  if (!API_URL) throw new Error("VITE_API_URL is not configured.");
  const res = await axios.post(
    API_URL,
    { prompt },
    { headers: { "Content-Type": "application/json" }, signal }
  );
  if (res.status !== 200 || !res.data?.image_data) {
    throw new Error("The model didn't return an image. Try again.");
  }
  return toSrc(res.data.image_data as string);
}

let galleryCache: Promise<GalleryImage[]> | null = null;

export function fetchGallery(): Promise<GalleryImage[]> {
  if (galleryCache) return galleryCache;
  if (!IMG_URL) return Promise.reject(new Error("VITE_IMG_URL is not configured."));

  galleryCache = axios
    .get<RawImage[]>(IMG_URL)
    .then((res) => {
      if (!Array.isArray(res.data)) throw new Error("Unexpected gallery response.");
      return res.data
        .filter((img) => img.imageData && img.prompt && isClean(img.prompt))
        .map((img) => ({
          id: img.id,
          prompt: tidyPrompt(img.prompt),
          src: toSrc(img.imageData),
          createdAt: img.createdAt,
        }))
        .reverse();
    })
    .catch((err) => {
      galleryCache = null;
      throw err;
    });

  return galleryCache;
}

export function downloadImage(src: string, name = `imagify-${Date.now()}.jpg`) {
  const a = document.createElement("a");
  a.href = src;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function slugify(prompt: string) {
  return (
    prompt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "image"
  );
}
