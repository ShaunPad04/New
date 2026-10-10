"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Watch3D, { type W3DState } from "./Watch3D";

/**
 * The shop layout's pictures (?v=pdp:a, Shaun, 8 Oct 2026: "the product to one side and then the
 * add to basket ... an e-commerce kind of vibe"): the piece large on the stage, and a row of
 * thumbnails under it the way a shop shows them: the front, the back where there is one (the
 * studio image the card shows on hover), and the 360° model where there is one. On a computer a
 * watch with a model opens on it once it has loaded, the photo standing in until then, as before.
 * Phones and tablets open on the photo and load the model only when 360° is tapped, with a bar
 * under the thumbnail filling as it comes (pre-launch QA, 8 Oct 2026): three.js and a model are
 * 3 to 5 MB and a burst of work a phone should not spend on every product page it opens.
 */
type View = "front" | "back" | "3d";

const Turn = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
    <ellipse cx="10" cy="10" rx="7.5" ry="3.2" fill="none" stroke="currentColor" strokeWidth="1.3" />
    <path d="M14.6 5.6l2.3 1.2-1.1 2.3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Gallery({ front, back, alt, cut, model, label }: { front: string; back?: string; alt: string; cut: boolean; model?: string; label: string }) {
  const [view, setView] = useState<View>("front");
  const [w3d, setW3d] = useState<W3DState>("idle");
  const [pct, setPct] = useState(0);
  // decided after hydration (the server cannot know the device): computers load and open on the
  // model, phones and tablets wait for a tap
  const [device, setDevice] = useState<"desk" | "touch" | null>(null);
  useEffect(() => {
    if (!model) return;
    const desk = matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches;
    setDevice(desk ? "desk" : "touch");
    if (desk) setView("3d");
  }, [model]);
  const has3d = !!model && w3d !== "error";
  const shown: View = view === "3d" && !has3d ? "front" : view;

  const thumbs: { id: View; label: string; img?: string }[] = [
    { id: "front", label: "Front", img: front },
    ...(back ? [{ id: "back" as View, label: "Back", img: back }] : []),
    ...(has3d ? [{ id: "3d" as View, label: "360°" }] : []),
  ];

  return (
    <div className="pdg">
      <div className="pdb-stage pdv-stage pdg-stage">
        <div className={`pdb-photo pdv-photo${cut ? " is-cut" : ""}`}>
          <Image src={front} alt={alt} fill priority sizes="(min-width: 1024px) 52vw, 92vw" className={`pdb-img pdg-img${shown === "back" ? " is-off" : ""}`} />
          {back && <Image src={back} alt={`The back of ${label}, a studio image`} fill sizes="(min-width: 1024px) 52vw, 92vw" className={`pdb-img pdg-img pdg-back${shown === "back" ? "" : " is-off"}`} />}
        </div>
        {model && device && <Watch3D src={model} label={label} pick={shown === "3d" ? "3d" : "photo"} onState={setW3d} onProgress={setPct} auto={device === "desk"} />}
      </div>
      {thumbs.length > 1 && (
        <div className="pdg-thumbs" role="group" aria-label="Pictures">
          {thumbs.map((t) => (
            <button key={t.id} type="button" className="pdg-thumb" aria-pressed={shown === t.id} onClick={() => setView(t.id)} aria-busy={t.id === "3d" && w3d === "loading"}>
              {t.img ? (
                <span className="pdg-thumb-img">
                  <Image src={t.img} alt="" fill sizes="80px" />
                </span>
              ) : (
                <span className="pdg-thumb-img is-turn">
                  <Turn />
                  {w3d === "loading" && (
                    <span className="w3d-load" aria-hidden="true">
                      <span style={{ transform: `scaleX(${Math.max(0.06, pct)})` }} />
                    </span>
                  )}
                </span>
              )}
              <span className="pdg-thumb-label">{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
