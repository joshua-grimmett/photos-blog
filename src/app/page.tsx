import Link from 'next/link';
import Image from 'next/image';
import { type BlogEntry, getAllBlogs } from './utils/contentful';
import { type Asset } from 'contentful';

function CarouselIcon(props: React.SVGProps<SVGSVGElement>) {
  // Front square top-left, back square bottom-right (like Instagram).
  // Draw back first so it peeks on the right/bottom. No stroke = no gap.
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' {...props}>
      <rect x='8' y='8' width='12' height='12' rx='3' />
      <rect x='3' y='3' width='12' height='12' rx='3' />
    </svg>
  );
}

function getPostImage(blog: BlogEntry): string {
  const featured = (blog.fields.featuredImage as Asset | undefined)?.fields
    ?.file?.url;
  if (featured) return `https:${featured}`;

  const galleryFirst = (blog.fields.imageGallery as Asset[])?.[0]?.fields?.file
    ?.url;
  if (galleryFirst) return `https:${galleryFirst}`;

  return '/placeholder.png';
}

function BlogCard({ blog }: { blog: BlogEntry }) {
  const img = getPostImage(blog);
  const isCarousel =
    !blog.fields.featuredImage &&
    (blog.fields.imageGallery as Asset[])?.length > 1;

  return (
    <div className='relative aspect-square overflow-hidden rounded-xl'>
      <Image
        src={img}
        alt={blog.fields.title as string}
        fill
        className='object-cover'
        sizes='(max-width:768px) 50vw, (max-width:1024px) 25vw, 20vw'
      />

      {isCarousel && (
        <div className='absolute right-2 top-2 rounded p-1 text-white'>
          <CarouselIcon className='h-5 w-5' />
        </div>
      )}
    </div>
  );
}

export default async function Home() {
  const blogs = await getAllBlogs();

  return (
    <section>
      <h1 className='mb-6 text-2xl font-semibold'>Latest posts</h1>

      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
        {blogs.map((blog: BlogEntry) => {
          return (
            <Link
              href={`/blog/${blog.fields.slug as string}`}
              key={blog.fields.slug as string}
              className='group relative block overflow-hidden rounded-xl'
            >
              <div className='relative aspect-square'>
                <BlogCard blog={blog} />
              </div>
              <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
              <div className='pointer-events-none absolute inset-x-0 bottom-0 p-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                <h2 className='line-clamp-1 text-sm font-medium'>
                  {blog.fields.title as string}
                </h2>
                {blog.fields.subtitle && (
                  <p className='line-clamp-1 text-xs text-white/80'>
                    {blog.fields.subtitle as string}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
