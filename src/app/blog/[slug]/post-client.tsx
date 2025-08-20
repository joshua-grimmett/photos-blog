'use client';

import { useState, useMemo } from 'react';
import { GalleryItem, GalleryLightbox } from '~/components/gallery-lightbox';
import Image from 'next/image';
import Link from 'next/link';
import type { Asset, Entry } from 'contentful';
import type { BlogEntry, AuthorFields } from '~/app/utils/contentful';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { CalendarDays } from 'lucide-react';

function assetUrl(a?: Asset) {
  const u = a?.fields?.file?.url;
  return u
    ? typeof u === 'string' && u.startsWith('http')
      ? u
      : `https:${u}`
    : undefined;
}

// Contentful transform helpers (fast thumbs + high-quality lightbox)
function cf(url?: string, params: Record<string, string | number> = {}) {
  if (!url) return undefined;
  const u = new URL(url);
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, String(v)));
  return u.toString();
}
const thumbOf = (url?: string) =>
  cf(url, { w: 480, h: 480, fit: 'thumb', fm: 'webp', q: 50 });
const fullOf = (url?: string) => cf(url, { w: 2000, fm: 'webp', q: 82 });

export default function PostClient({
  blog,
  displayDate,
}: {
  blog: BlogEntry;
  displayDate: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const featuredRaw = assetUrl(blog.fields.featuredImage as Asset);
  // Prefer a wide featured image (faster LCP via priority + high fetchPriority)
  const featuredImg = useMemo(
    () => featuredRaw && cf(featuredRaw, { w: 1600, fm: 'webp', q: 80 }),
    [featuredRaw],
  );

  const author = (blog.fields.author as Entry<AuthorFields> | undefined)
    ?.fields;
  const authorAvatar = assetUrl(author?.avatar as Asset);

  const markdown =
    typeof blog.fields.content === 'string' ? blog.fields.content : '';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const gallery = (blog.fields.imageGallery as Asset[] | undefined) ?? [];
  const galleryItems = useMemo(
    () =>
      gallery
        .map((img) => {
          const raw = assetUrl(img);
          return {
            full: fullOf(raw)!,
            thumb: thumbOf(raw)!,
            alt: img?.fields?.title || blog.fields.title || 'Gallery image',
            w: (
              img?.fields?.file as unknown as {
                details: { image: { width: number } };
              }
            )?.details?.image?.width as number | undefined,
            h: (
              img?.fields?.file as unknown as {
                details: { image: { height: number } };
              }
            )?.details?.image?.height as number | undefined,
          };
        })
        .filter((g) => Boolean(g.full) && Boolean(g.thumb)),
    [gallery, blog.fields.title],
  );

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
              {displayDate}
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
            fetchPriority='high'
            sizes='(max-width: 768px) 100vw, 100vw'
            decoding='async'
          />
        </div>
      )}

      {markdown && (
        <div className='prose prose-neutral dark:prose-invert max-w-none mb-8'>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }],
            ]}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      )}

      {galleryItems.length > 0 && (
        <>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
            {galleryItems.map((it, i) => (
              <button
                key={i}
                type='button'
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
                className='group relative aspect-square overflow-hidden rounded-lg'
              >
                <Image
                  src={it.thumb}
                  alt={it.alt as string}
                  fill
                  loading='lazy'
                  decoding='async'
                  sizes='(max-width:768px) 50vw, (max-width:1024px) 25vw, 20vw'
                  className='object-cover transition-transform group-hover:scale-105'
                />
              </button>
            ))}
          </div>

          <GalleryLightbox
            items={galleryItems as unknown as GalleryItem[]}
            startIndex={lightboxIndex}
            open={lightboxOpen}
            onOpenChange={setLightboxOpen}
          />
        </>
      )}
    </article>
  );
}
