import { notFound } from 'next/navigation';
import { getAllBlogs } from '~/app/utils/contentful';
import type { BlogEntry } from '~/app/utils/contentful';
import PostClient from './post-client';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blogs: BlogEntry[] = await getAllBlogs();
  const blog = blogs.find((b) => b.fields.slug === slug);
  if (!blog) return notFound();

  const publishedRaw =
    blog.fields.publishedDate ??
    blog.sys?.createdAt ??
    new Date().toISOString();
  const displayDate = new Date(publishedRaw as string)
    .toISOString()
    .slice(0, 10); // YYYY-MM-DD (UTC, stable)

  return <PostClient blog={blog} displayDate={displayDate} />;
}
