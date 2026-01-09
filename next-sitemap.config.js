const { PrismaClient } = require("./src/generated/client");

// Initialize Prisma with error handling
let prisma;
try {
  prisma = new PrismaClient();
} catch (error) {
  console.warn(
    "Warning: Could not initialize Prisma client for sitemap generation:",
    error.message
  );
  prisma = null;
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://gii.prabisha.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false, // Ensure sitemap.xml is created directly
  sitemapSize: 50000,
  exclude: [
    "/admin",
    "/admin/*",
    "/api",
    "/api/*",
    "/login",
    "/sign-in",
    "/sign-in/*",
    "/register",
    "/reset-password",
    "/forgot-password",
    "/verify-email",
    "/resend-verification",
    "/server-sitemap.xml", // Exclude if used
  ],

  // Generate additional sitemaps for dynamic content
  additionalPaths: async (config) => {
    const result = [];

    // Add static pages explicitly
    const staticPages = [
      "/",
      "/about",
      "/contact",
      "/news",
      "/magazines",
      "/articles",
      "/business",
      "/culture",
      "/diaspora",
      "/listings",
      "/resources",
      "/success-stories",
    ];

    staticPages.forEach((page) => {
      result.push({
        loc: page,
        changefreq: "daily",
        priority: 0.7,
      });
    });

    // Only fetch dynamic content if Prisma is available
    if (prisma) {
      try {
        // 1. Fetch Published Articles (Posts)
        // Adjust status enum based on schema: DRAFT, REVIEW, PUBLISHED, ARCHIVED
        const posts = await prisma.post.findMany({
          where: {
            status: "PUBLISHED",
            visibility: "PUBLIC",
          },
          select: { slug: true, updatedAt: true },
        });

        posts.forEach((post) => {
          result.push({
            loc: `/articles/${post.slug}`,
            lastmod: post.updatedAt.toISOString(),
            changefreq: "daily",
            priority: 0.8,
          });
        });

        // 2. Fetch Published Magazines
        // Adjust status enum based on schema: DRAFT, REVIEW, PUBLISHED, ARCHIVED
        const magazines = await prisma.magazine.findMany({
          where: { status: "PUBLISHED" },
          select: { slug: true, updatedAt: true },
        });

        magazines.forEach((magazine) => {
          result.push({
            loc: `/magazines/${magazine.slug}`,
            lastmod: magazine.updatedAt.toISOString(),
            changefreq: "weekly",
            priority: 0.7,
          });
        });

        // 3. Fetch Categories
        const categories = await prisma.category.findMany({
          select: { slug: true },
        });

        categories.forEach((category) => {
          result.push({
            loc: `/category/${category.slug}`,
            changefreq: "weekly",
            priority: 0.7,
          });
        });
      } catch (error) {
        console.error("Error generating dynamic sitemap paths:", error);
      } finally {
        await prisma.$disconnect();
      }
    } else {
      console.warn(
        "Warning: Skipping dynamic sitemap generation due to Prisma initialization error"
      );
    }

    return result;
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/login", "/sign-in", "/register"],
      },
    ],
  },

  outDir: "./public",
};
