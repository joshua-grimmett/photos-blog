import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AuthorFields, BlogEntry, getAllBlogs } from '~/app/utils/contentful';
import type { Asset, Entry } from 'contentful';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { CalendarDays } from 'lucide-react';

function assetUrl(a?: Asset) {
  const url = a?.fields?.file?.url;
  return url
    ? typeof url === 'string' && url.startsWith('http')
      ? url
      : `https:${url}`
    : undefined;
}

export async function generateStaticParams() {
  const blogs = await getAllBlogs();
  return blogs.map((b: BlogEntry) => ({ slug: b.fields.slug as string }));
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const blogs = await getAllBlogs();
  const blog = blogs.find((b: BlogEntry) => b.fields.slug === params.slug);
  if (!blog) return notFound();

  const featuredImg = assetUrl(
    (blog.fields.featuredImage as Asset) ?? undefined,
  );

  // Narrow author to an Entry with fields (Contentful refs are unions)
  const authorEntry = blog.fields.author as Entry<AuthorFields> | undefined;
  const author = authorEntry?.fields;

  const authorAvatar = assetUrl(author?.avatar as Asset);

  const published =
    blog.fields.publishedDate ??
    blog.sys?.createdAt ??
    new Date().toISOString();

  const markdown: string =
    typeof blog.fields.content === 'string' ? blog.fields.content : '';

  return (
    <article className='mx-auto max-w-2xl'>
      <nav className='mb-6 text-sm text-muted-foreground'>
        <Link href='/' className='hover:underline'>
          Home
        </Link>{' '}
        / <span>{blog.fields.title as string}</span>
      </nav>

      <h1 className='mb-2 text-3xl font-semibold tracking-tight'>
        {blog.fields.title as string}
      </h1>
      {blog.fields.subtitle && (
        <p className='mb-4 text-muted-foreground'>
          {blog.fields.subtitle as string}
        </p>
      )}

      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Avatar>
            <AvatarImage src={authorAvatar} />
            <AvatarFallback>
              {author?.name?.toString().slice(0, 2)?.toUpperCase() ?? 'AU'}
            </AvatarFallback>
          </Avatar>
          <div className='leading-none'>
            <p className='text-sm font-medium'>
              {author?.name?.toString() ?? 'Author'}
            </p>
            <p className='mt-1 flex items-center gap-1 text-xs text-muted-foreground'>
              <CalendarDays className='h-3.5 w-3.5' />
              {new Date(published.toString()).toLocaleDateString()}
            </p>
          </div>
        </div>
        {typeof blog.fields.rating === 'number' && (
          <Badge variant='secondary'>Rating: {blog.fields.rating}</Badge>
        )}
      </div>

      {featuredImg && (
        <div className='mb-6 overflow-hidden rounded-xl'>
          <Image
            src={featuredImg}
            alt={(blog.fields.title as string) || 'Featured image'}
            width={1200}
            height={630}
            className='h-auto w-full object-cover'
            priority
          />
        </div>
      )}

      <div className='prose prose-neutral dark:prose-invert max-w-none'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          ]}
        >
          {markdown || '_No content yet._'}
        </ReactMarkdown>
      </div>
    </article>
  );
}
