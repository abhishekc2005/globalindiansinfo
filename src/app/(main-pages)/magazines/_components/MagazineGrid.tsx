"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CalendarDays, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface Magazine {
  id: string;
  title: string | null;
  description?: string | null;
  coverImageUrl?: string | null;
  issueNumber?: number | null;
  publishedAt?: Date | null;
  slug: string;
}

export default function MagazineGrid({ magazines }: { magazines: Magazine[] }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
    >
      {magazines.map((magazine) => (
        <MagazineCard key={magazine.id} magazine={magazine} variants={item} />
      ))}
    </motion.div>
  );
}

function MagazineCard({
  magazine,
  variants,
}: {
  magazine: Magazine;
  variants: any;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div variants={variants}>
      <Card className="overflow-hidden py-0 flex flex-col h-full hover:shadow-lg transition-shadow duration-300 border-none shadow-md bg-card/50 backdrop-blur-sm">
        <div className="aspect-3/4 relative bg-muted overflow-hidden group">
          {magazine.coverImageUrl && !imageError ? (
            <img
              src={magazine.coverImageUrl}
              alt={magazine.title || "Magazine Cover"}
              className="object-cover w-full h-full  transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/30 text-secondary-foreground p-4 text-center">
              <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
              <span className="text-xs font-medium opacity-70">
                No Cover Available
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Link href={`/magazines/${magazine.slug}`}>
              <Button variant="secondary" size="sm" className="font-semibold">
                Read Now
              </Button>
            </Link>
          </div>
        </div>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <CalendarDays className="w-3 h-3" />
            <span>
              {magazine.publishedAt
                ? new Date(magazine.publishedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Coming Soon"}
            </span>
          </div>
          <CardTitle className="line-clamp-2 text-lg font-bold leading-tight hover:text-primary transition-colors">
            <Link href={`/magazines/${magazine.slug}`}>{magazine.title}</Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {magazine.description}
          </p>
        </CardContent>
        {/* Removed Issue Number as requested */}
      </Card>
    </motion.div>
  );
}
