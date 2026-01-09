import { auth } from "@/lib/auth";
import { usersService } from "@/services/users/users.service";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// -----------------------------------------------------------------------------
// HANDLERS
// -----------------------------------------------------------------------------

async function handleGetMe() {
  const session = await auth();
  if (!session?.user?.username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await usersService.getCurrentUserProfile(session.user.username);
  return NextResponse.json({ success: true, data: { user } });
}

async function handleGetProfile(userId: string) {
  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }
  const userProfile = await usersService.getCurrentUserProfile(userId);
  if (!userProfile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: userProfile });
}

async function handleUpdateName(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { name: name.trim() },
    });
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating name:", error);
    return NextResponse.json(
      { error: "Failed to update name" },
      { status: 500 }
    );
  }
}

// -----------------------------------------------------------------------------
// MAIN ROUTE HANDLER
// -----------------------------------------------------------------------------

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  const path = slug?.[0];

  // Route: /api/users/me
  if (path === "me") {
    return handleGetMe();
  }

  // Route: /api/users/profile/[userId]
  // slug would be ['profile', 'userId']
  if (path === "profile" && slug?.[1]) {
    return handleGetProfile(slug[1]);
  }

  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  const path = slug?.[0];

  // Route: /api/users/update-name
  if (path === "update-name") {
    return handleUpdateName(req);
  }

  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}
