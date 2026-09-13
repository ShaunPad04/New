import { ImageResponse } from "next/og";
import { site } from "@/lib/content";

export const alt = "New Home Agents — Nationwide New Homes, Part Exchange & Assisted Move";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "linear-gradient(180deg,#d7edf9 0%,#c3e5f7 45%,#8fb6cc 100%)", color: "#080b0f", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 28, fontWeight: 600 }}>{site.name}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1 }}>Your next home starts here.</div>
          <div style={{ fontSize: 30, color: "#4b5b63" }}>{site.tagline}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#4b5b63" }}>
          <span>{site.phone}</span>
          <span>newhomeagents.co.uk</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
