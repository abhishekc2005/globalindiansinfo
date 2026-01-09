"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ImportantLink {
  id: number;
  title: string;
  link: string;
  country?: string;
}

interface ImportantLinksBrowserProps {
  initialLinks: ImportantLink[];
}

export function ImportantLinksBrowser({
  initialLinks,
}: ImportantLinksBrowserProps) {
  const [selectedCountry, setSelectedCountry] =
    useState<string>("All Countries");

  // Get unique countries from links
  const countries = [
    "All Countries",
    ...Array.from(
      new Set(initialLinks.map((link) => link.country || "Global"))
    ).sort(),
  ];

  const filteredLinks =
    selectedCountry === "All Countries"
      ? initialLinks
      : initialLinks.filter(
          (link) => (link.country || "Global") === selectedCountry
        );

  return (
    <div className="space-y-8 font-sans">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
          <Globe className="w-8 h-8 text-emerald-500" />
          Important Links
          <Globe className="w-8 h-8 text-blue-500" />
        </h1>
        <p className="text-muted-foreground max-w-4xl mx-auto text-sm flex items-start justify-center gap-2">
          <span className="mt-1">📚</span>
          <span>
            Explore essential resources, government websites, and key services
            for Indians worldwide. This page consolidates important links from
            various countries, offering quick access to the most reliable and
            up-to-date information.
          </span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Filter */}
        <div className="w-full md:w-64 shrink-0">
          <Card>
            <CardHeader className="pb-4">
              <h3 className="font-bold text-lg text-foreground">
                Filter by Country
              </h3>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {countries.map((country) => (
                  <li key={country}>
                    <button
                      onClick={() => setSelectedCountry(country)}
                      className={cn(
                        "w-full text-left px-4 py-3 text-sm font-medium transition-colors",
                        selectedCountry === country
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {country}
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1 w-full">
          <h2 className="text-xl font-bold text-foreground mb-6 border-b pb-2 border-border">
            {selectedCountry === "All Countries"
              ? "All Important Links"
              : `${selectedCountry} Links`}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredLinks.map((link) => (
              <Card
                key={link.id}
                className="flex flex-col h-44 hover:shadow-md transition-shadow duration-200 w-56 "
              >
                <CardHeader className="text-center pb-2 pt-6">
                  <CardTitle className="text-base font-bold text-card-foreground line-clamp-2 min-h-12 flex items-center justify-center">
                    {link.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mt-1">
                    {link.country || "Global"}
                  </p>
                </CardHeader>
                <CardFooter className="">
                  <Button
                    asChild
                    className="w-full rounded-md h-10"
                  >
                    <Link href={link.link} target="_blank">
                      Visit Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {filteredLinks.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground bg-muted rounded-lg">
                No links found for this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}