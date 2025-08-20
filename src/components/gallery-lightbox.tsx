'use client';

import * as React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

export type GalleryItem = {
  full: string; // large image url
  thumb: string; // small image url (unused here but handy for preloading)
  alt: string;
  w?: number; // original width (optional)
  h?: number; // original height (optional)
};

export function GalleryLightbox({
  items,
  startIndex = 0,
  open,
  onOpenChange,
}: {
  items: GalleryItem[];
  startIndex?: number;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [index, setIndex] = React.useState(startIndex);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex });

  React.useEffect(() => setIndex(startIndex), [startIndex, open]);

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index, true);
    const onSelect = () => setIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => {
      // ensure cleanup returns void (not the result of .off)
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, index]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'ArrowRight') emblaApi?.scrollNext();
      if (e.key === 'ArrowLeft') emblaApi?.scrollPrev();
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, emblaApi, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='border-0 bg-transparent p-0 shadow-none sm:max-w-[95vw]'>
        <button
          className='absolute right-4 top-4 z-20 rounded-full bg-background/70 p-1 backdrop-blur hover:bg-background/90'
          onClick={() => onOpenChange(false)}
          aria-label='Close'
        >
          <X className='h-5 w-5' />
        </button>

        <div className='relative mx-auto my-8 h-[min(88vh,calc(100dvh-4rem))] w-[min(95vw,1400px)]'>
          <div className='h-full overflow-hidden rounded-xl' ref={emblaRef}>
            <div className='flex h-full'>
              {items.map((it, i) => (
                <div className='relative min-w-0 flex-[0_0_100%]' key={i}>
                  <div className='relative h-full w-full'>
                    <Image
                      src={it.full}
                      alt={it.alt || `Image ${i + 1}`}
                      fill
                      priority={i === startIndex}
                      loading={i === startIndex ? 'eager' : 'lazy'}
                      sizes='(max-width: 1400px) 95vw, 1400px'
                      className='object-contain'
                      fetchPriority={i === startIndex ? 'high' : 'auto'}
                      decoding='async'
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='pointer-events-none absolute inset-0 flex items-center justify-between px-2'>
            <Button
              variant='ghost'
              size='icon'
              className='pointer-events-auto rounded-full bg-background/70 backdrop-blur hover:bg-background/90'
              onClick={() => emblaApi?.scrollPrev()}
              aria-label='Previous image'
            >
              <ChevronLeft className='h-5 w-5' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='pointer-events-auto rounded-full bg-background/70 backdrop-blur hover:bg-background/90'
              onClick={() => emblaApi?.scrollNext()}
              aria-label='Next image'
            >
              <ChevronRight className='h-5 w-5' />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
