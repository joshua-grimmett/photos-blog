import Link from 'next/link';
import Image from 'next/image';
import { type BlogEntry, getAllBlogs } from './utils/contentful';
import { type Asset } from 'contentful';

export default async function Home() {
  const blogs = await getAllBlogs();

  return (
    <section>
      <h1 className='mb-6 text-2xl font-semibold'>Latest posts</h1>

      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
        {blogs.map((blog: BlogEntry) => {
          const img =
            blog.fields.featuredImage &&
            (blog.fields.featuredImage as Asset).fields.file?.url
              ? 'https:' + (blog.fields.featuredImage as Asset).fields.file!.url
              : '/placeholder.png';

          return (
            <Link
              href={`/blog/${blog.fields.slug as string}`}
              key={blog.fields.slug as string}
              className='group relative block overflow-hidden rounded-xl'
            >
              <div className='relative aspect-square'>
                <Image
                  src={img}
                  alt={(blog.fields.title as string) || 'Post image'}
                  fill
                  sizes='(max-width:768px) 50vw, (max-width:1024px) 25vw, 20vw'
                  className='object-cover transition-transform duration-300 group-hover:scale-105'
                />
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
