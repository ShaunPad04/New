"use client";

import { useSyncExternalStore } from "react";

/**
 * The enquiry basket (Shaun, 7 Oct 2026): pieces a visitor wants to ask about, kept in this
 * browser only (localStorage), never priced and never paid for online. "Enquire" carries the
 * list to the enquiry form. Nothing is sent anywhere until the visitor sends that form.
 */
export type BasketItem = { id: string; title: string; image: string; href: string; category: string };

const KEY = "slj-basket-v1";
const MAX = 12;
type State = { items: BasketItem[]; open: boolean };
let state: State = { items: [], open: false };
let loaded = false;
const listeners = new Set<() => void>();

const load = () => {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (Array.isArray(raw)) state = { ...state, items: raw.filter((x) => x && typeof x.id === "string").slice(0, MAX) };
  } catch {
    /* private mode or bad data: start empty */
  }
};
const emit = (next: State, persist = false) => {
  state = next;
  if (persist) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state.items));
    } catch {
      /* storage blocked: the basket still works for this visit */
    }
  }
  listeners.forEach((l) => l());
};

const subscribe = (l: () => void) => {
  load();
  listeners.add(l);
  // another tab changed the basket
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    loaded = false;
    load();
    listeners.forEach((x) => x());
  };
  addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    removeEventListener("storage", onStorage);
  };
};
const EMPTY: State = { items: [], open: false };

export function useBasket() {
  return useSyncExternalStore(subscribe, () => (load(), state), () => EMPTY);
}

export const basket = {
  add(item: BasketItem) {
    load();
    if (state.items.some((x) => x.id === item.id)) return emit({ ...state, open: true });
    emit({ items: [...state.items, item].slice(-MAX), open: true }, true);
  },
  remove(id: string) {
    load();
    emit({ ...state, items: state.items.filter((x) => x.id !== id) }, true);
  },
  clear() {
    emit({ ...state, items: [] }, true);
  },
  open() {
    load();
    emit({ ...state, open: true });
  },
  close() {
    emit({ ...state, open: false });
  },
  snapshot(): BasketItem[] {
    load();
    return state.items;
  },
};
