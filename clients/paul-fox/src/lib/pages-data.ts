/** Typed access to the captured JSON content (surveys, blog, legal). */
import surveysJson from "@/data/surveys.json";
import blogJson from "@/data/blog.json";
import legalJson from "@/data/legal.json";
import type { Block } from "@/components/prose";

export type SurveyService = { slug: string; title: string; blocks: Block[] };
export type BlogPost = { slug: string; title: string; image: string; excerpt: string; blocks: Block[]; truncated: boolean; source: string };
export type LegalPage = { title: string; blocks: Block[] };

export const surveyServices = surveysJson as unknown as SurveyService[];
export const blogPosts = blogJson as unknown as BlogPost[];
export const legalPages = legalJson as unknown as Record<string, LegalPage>;

export const getSurvey = (slug: string) => surveyServices.find((s) => s.slug === slug);
export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);
