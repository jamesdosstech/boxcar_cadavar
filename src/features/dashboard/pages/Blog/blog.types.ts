import type { Timestamp } from "firebase/firestore";

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  author?: string | null;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
  published?: boolean;
};

export type BlogPostInput = {
  title: string;
  content: string;
  author?: string | null;
  published?: boolean;
};
