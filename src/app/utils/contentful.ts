import {
  createClient,
  type Entry,
  type Asset,
  EntrySkeletonType,
} from 'contentful';
import { env } from '~/app/utils/env';

export interface AuthorFields extends EntrySkeletonType {
  name?: string;
  username?: string;
  avatar?: Asset;
}

export interface BlogFields extends EntrySkeletonType {
  slug: string;
  author?: Entry<AuthorFields>;
  rating?: number;
  publishedDate?: string;
  title: string;
  subtitle?: string;
  featuredImage?: Asset;
  content?: string;
  relatedBlogPosts?: Entry<BlogFields>[];
  imageGallery?: Asset[];
}

export type BlogEntry = Entry<BlogFields>;

const client = createClient({
  space: env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_TOKEN,
});

export async function getAllBlogs(): Promise<BlogEntry[]> {
  if (!client) return [];
  const res = await client.getEntries<BlogFields>({
    content_type: 'blogPost',
    include: 2,
    order: ['-fields.publishedDate'],
  });
  return res.items;
}
