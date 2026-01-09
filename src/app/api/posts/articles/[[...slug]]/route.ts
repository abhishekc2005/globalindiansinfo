import { triggerPostWorkflows } from "@/lib/workflows/triggerPostWorkflows";
import { validate } from "@/lib/zod";
import {
  createPostSchema,
  updatePostSchema,
} from "@/services/posts/post.zod.schema";
import { postService } from "@/services/posts/posts.service";
import { tagService } from "@/services/posts/tags/tags.service";
import { NextResponse, NextRequest } from "next/server";
import { ZodError } from "zod";

// -----------------------------------------------------------------------------
// HELPER HANDLERS
// -----------------------------------------------------------------------------

// GET /api/posts/articles (List)
async function handleGetList(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const posts = await postService.getPublishedArticlesByCategory(
      category || ""
    );
    return NextResponse.json({ success: true, posts: posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// GET /api/posts/articles/featured
async function handleGetFeatured() {
  try {
    const posts = await postService.getFeaturedArticles();
    return NextResponse.json({ success: true, posts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// GET /api/posts/articles/[id]
async function handleGetById(id: string) {
  try {
    const post = await postService.getArticleById(id);
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, post }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/posts/articles (Create)
async function handleCreate(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedDataData = validate(createPostSchema, body);

    // Tag creation
    const tagRecords = await tagService.findOrCreateTags(
      validatedDataData.tags
    );

    const prismaData = {
      ...validatedDataData,
      scheduledAt: validatedDataData.scheduledAt
        ? new Date(validatedDataData.scheduledAt)
        : undefined,
      publishedAt: validatedDataData.publishedAt
        ? new Date(validatedDataData.publishedAt)
        : undefined,
      tags: {
        create: tagRecords.map((tag) => ({ tagId: tag.id })),
      },
    };

    const newPost = await postService.createArticle(prismaData);

    // Trigger async workflows
    setTimeout(() => {
      triggerPostWorkflows(newPost.id);
    }, 0);

    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation Failed", issues: error.issues },
        { status: 400 }
      );
    }
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/posts/articles/[id] (Update)
async function handleUpdate(req: NextRequest, id: string) {
  try {
    const body = await req.json();
    const validatedData = validate(updatePostSchema, body);
    let prismaData: any = { ...validatedData };

    if (validatedData.tags) {
      const tagRecords = await tagService.findOrCreateTags(validatedData.tags);
      prismaData.tags = {
        deleteMany: {},
        create: tagRecords.map((tag) => ({ tagId: tag.id })),
      };
    }

    if (validatedData.scheduledAt)
      prismaData.scheduledAt = new Date(validatedData.scheduledAt);
    if (validatedData.publishedAt)
      prismaData.publishedAt = new Date(validatedData.publishedAt);

    const updatedPost = await postService.updateArticle(id, prismaData);
    return NextResponse.json(
      { success: true, data: updatedPost },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation Failed", issues: error.issues },
        { status: 400 }
      );
    }
    console.error("Patch Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/articles/[id]
async function handleDelete(id: string) {
  try {
    await postService.deleteArticle(id);
    return NextResponse.json(
      { success: true, message: "Article deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// -----------------------------------------------------------------------------
// DISPATCHER
// -----------------------------------------------------------------------------

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;

  // List: /api/posts/articles
  if (!slug || slug.length === 0) {
    return handleGetList(req);
  }

  const firstSegment = slug[0];

  // Featured: /api/posts/articles/featured
  if (firstSegment === "featured") {
    return handleGetFeatured();
  }

  // Detail: /api/posts/articles/[id]
  return handleGetById(firstSegment);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  if (!slug || slug.length === 0) {
    return handleCreate(req);
  }
  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  if (slug && slug.length > 0) {
    return handleUpdate(req, slug[0]);
  }
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  if (slug && slug.length > 0) {
    return handleDelete(slug[0]);
  }
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
