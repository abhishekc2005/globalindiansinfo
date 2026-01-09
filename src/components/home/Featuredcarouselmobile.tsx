"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Clock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { motion, AnimatePresence } from "framer-motion";
import ImageWithFallback from "@/components/ui/image-with-fallback";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: { name: string; slug: string };
  author: { name: string; avatarUrl?: string };
  readTime: number;
  slug: string;
  image?: string;
  likes: number;
  views: number;
  publishedAt: string;
  coverImage?: string;
  coverImageUrl?: string;
}

export function FeaturedCarouselMobile({ items }: { items: Article[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }
    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  const goToSlide = React.useCallback(
    (index: number) => {
      if (api) {
        api.scrollTo(index);
      }
    },
    [api]
  );

  if (!items || items.length === 0) {
    return (
      <div className="w-full bg-background">
        <div className="aspect-4/3 bg-muted flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground text-sm">Loading stories...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full bg-background">
      {/* Image Carousel - Pure Image Display */}
      <div className="relative">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          className="w-full"
          opts={{ loop: true }}
        >
          <CarouselContent>
            {items.map((item) => (
              <CarouselItem key={item.id}>
                <article className="relative w-full aspect-4/3 overflow-hidden ">
                  {/* Blurred Background (same size) */}
                  <ImageWithFallback
                    src={
                      item.coverImageUrl ||
                      item.coverImage ||
                      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1920"
                    }
                    alt=""
                    className="absolute inset-0 w-full object-cover blur-3xl opacity-30 scale-110"
                  />

                  {/* Main Image (same size, no empty space) */}
                  <ImageWithFallback
                    src={
                      item.coverImageUrl ||
                      item.coverImage ||
                      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1920"
                    }
                    alt={item.title}
                    className="relative z-10 w-full h-full object-contain"
                  />
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Pagination Dots Over Image */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 z-10 px-4">
          {items.map((_, index) => (
            <button
              key={index}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white w-8 h-2"
                  : "bg-white/50 w-2 h-2 hover:bg-white/70"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? "true" : "false"}
            />
          ))}
        </div>
      </div>

      {/* Content Card - Below Image with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="px-4 py-6"
        >
          <div className="space-y-4">
            {/* Category Badge */}
            {currentItem.category && (
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {currentItem.category.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              {currentItem.title}
            </h2>

          
            {/* Author & Meta Info */}
            <div className="flex flex-wrap items-center gap-4 py-2">
              {currentItem.author && (
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border-2 border-border overflow-hidden ring-2 ring-primary/10">
                    {currentItem.author.avatarUrl ? (
                      <ImageWithFallback
                        src={currentItem.author.avatarUrl}
                        alt={currentItem.author.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      {currentItem.author.name}
                    </span>
                    {currentItem.readTime && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{currentItem.readTime} min read</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link href={`/articles/${currentItem.slug}`} className="block">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-8 py-3 shadow-lg hover:shadow-primary/25 transition-all duration-300 w-full group"
                >
                  <span>Read Full Story</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
