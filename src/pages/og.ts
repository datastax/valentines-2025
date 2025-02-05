import satori from "satori";
import { html } from "satori-html";
import type { APIRoute } from "astro";
import sharp from "sharp";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const q = decodeURIComponent(url.searchParams.get("poem") ?? "");
  const username = decodeURIComponent(url.searchParams.get("username") ?? "");
  const markup = html(`<div
    style="color: white;hyphens: auto; word-break: break-word; word-wrap: break-all; background-image: url(${
      new URL(request.url).origin
    }/og-poem-bg.png); overflow: hidden; text-overflow: ellipsis; background-size: cover; font-family: Sora; height: 100vh; width: 100vw; box-sizing: border-box; background-color: white; font-size: 56px; display: flex; gap: 16px; align-items: center; padding: 40px; font-weight: 600;"
  >
    <div style="display: flex; flex-direction: column;">${q?.slice(0, 123)}${
    (q?.length ?? 0) > 123 ? "..." : ""
  }</div>
  <div style="display: flex; justify-content: flex-end;"><img style="border-radius: 50%;" alt="${username}" src="https://github.com/${username}.png" width="250" height="250" /></div>
  </div>`);

  const fontFile = await fetch(`${url.origin}/fonts/sora-instance.ttf`).then(
    (res) => res.arrayBuffer()
  );

  // @ts-ignore
  const svg = await satori(markup, {
    width: 1200,
    fonts: [
      {
        name: "Sora",
        data: fontFile,
        style: "normal",
      },
    ],
    height: 630,
  });

  const png = sharp(Buffer.from(svg)).png();
  const response = await png.toBuffer();

  return new Response(response, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "s-maxage=1, stale-while-revalidate=59",
    },
  });
};
