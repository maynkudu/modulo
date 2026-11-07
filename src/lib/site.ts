const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://modulo.maynkudu.com");

if (
  !["https:", "http:"].includes(origin.protocol) ||
  origin.pathname !== "/" || origin.search || origin.hash || origin.username || origin.password
) {
  throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTP or HTTPS origin without a path or credentials.");
}

export const siteUrl = origin.origin;

export function absoluteUrl(path: string) {
  return new URL(path, `${siteUrl}/`).href;
}
