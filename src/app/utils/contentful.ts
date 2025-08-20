import { createClient, Entry, Asset, EntrySkeletonType } from 'contentful';
import { env } from './env';

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
  content?: string; // markdown string you store in Contentful
  relatedBlogPosts?: Entry<BlogFields>[];
  videoGallery?: Asset[];
}

export type BlogEntry = Entry<BlogFields>;

const client = createClient({
  space: env.CONTENTFUL_SPACE_ID,
  accessToken: env.CONTENTFUL_DELIVERY_TOKEN,
});

export async function getAllBlogs(): Promise<BlogEntry[]> {
  const res = await client.getEntries<BlogFields>({
    content_type: 'blogPost',
    include: 2,
    order: ['-fields.publishedDate'],
  });
  return res.items;
}
