"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Clock, User } from "lucide-react";
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

export function FeaturedCarousel({ items }: { items: Article[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const plugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }
    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  const handlePrevious = React.useCallback(() => {
    if (api) {
      api.scrollPrev();
    }
  }, [api]);

  const handleNext = React.useCallback(() => {
    if (api) {
      api.scrollNext();
    }
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
      <div className="w-full aspect-video max-h-[900px] bg-muted flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading featured stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full group">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        opts={{ loop: true }}
        onMouseEnter={() => {
          plugin.current.stop();
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          plugin.current.reset();
          setIsHovered(false);
        }}
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={item.id}>
              <article className="relative w-full aspect-video max-h-[600px]">
                {/* Image Container - 16:9 aspect ratio */}
                <div className="absolute inset-0 overflow-hidden bg-black">
                  {/* Blurred Background Layer */}
                  <div className="absolute inset-0">
                    <ImageWithFallback
                      src={
                        item.coverImageUrl ||
                        item.coverImage ||
                        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1920"
                      }
                      alt=""
                      className="w-full h-full object-contain blur-3xl opacity-50 scale-110"
                    />
                  </div>

                  {/* Main Image Layer */}
                  <motion.div
                    initial={{ scale: 1 }}
                    transition={{ duration: 6, ease: "linear" }}
                    className="absolute inset-0 flex items-center justify-center "
                  >
                    <ImageWithFallback
                      src={
                        item.coverImageUrl ||
                        item.coverImage ||
                        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1920"
                      }
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                </div>

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-transparent to-transparent" />

                {/* Content - Always visible on desktop */}
                <div className="absolute inset-0 flex flex-col justify-end">
                  <div className="container mx-auto px-8 pb-20 max-w-7xl">
                    <div className="max-w-2xl">
                      <div className="space-y-4">
                        {item.category && (
                          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/30 border border-primary/40 backdrop-blur-sm">
                            <span className="text-xs font-bold uppercase tracking-wider text-white">
                              {item.category.name}
                            </span>
                          </div>
                        )}

                        <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                          {item.title}
                        </h2>

                        {item.excerpt && (
                          <p className="text-base lg:text-lg text-gray-200 leading-relaxed line-clamp-2">
                            {item.excerpt}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 pt-2">
                          {item.author && (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center border border-white/25 overflow-hidden">
                                {item.author.avatarUrl ? (
                                  <ImageWithFallback
                                    src={item.author.avatarUrl}
                                    alt={item.author.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <span className="font-medium">
                                {item.author.name}
                              </span>
                            </div>
                          )}

                          {item.readTime && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{item.readTime} min read</span>
                            </div>
                          )}
                        </div>

                        <div className="pt-3">
                          <Link href={`/articles/${item.slug}`}>
                            <Button
                              size="lg"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-8 py-3 shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
                            >
                              Read Full Story
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Extra Info Card */}
                <AnimatePresence>
                  {isHovered && index === currentIndex && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="absolute bottom-32 left-8 right-8 max-w-3xl mx-auto"
                    >
                      <div className="backdrop-blur-lg bg-black/30 rounded-2xl border border-white/10 shadow-2xl p-6">
                        <p className="text-gray-200 text-sm leading-relaxed">
                          {item.excerpt}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/30 hover:bg-black/50 text-white rounded-full w-12 h-12 backdrop-blur-md border border-white/20 pointer-events-auto"
          onClick={handlePrevious}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/30 hover:bg-black/50 text-white rounded-full w-12 h-12 backdrop-blur-md border border-white/20 pointer-events-auto"
          onClick={handleNext}
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-3 z-10 px-4">
        {items.map((_, index) => (
          <button
            key={index}
            className={`rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary w-10 h-2"
                : "bg-white/40 w-2.5 h-2 hover:bg-white/60"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  );
}