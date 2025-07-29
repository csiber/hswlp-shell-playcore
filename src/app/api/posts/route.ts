import { NextResponse } from "next/server";
import { getAllPosts, createPost } from "@/db/post";
import { requireVerifiedEmail } from "@/utils/auth";
import { withRateLimit, RATE_LIMITS } from "@/utils/with-rate-limit";

export async function GET() {
  const posts = await getAllPosts();
  return NextResponse.json(posts);
}

interface CreatePostRequest {
  title: string;
  content?: string | null;
}

export async function POST(request: Request) {
  const session = await requireVerifiedEmail();

  if (!session) {
    throw new Error("Not authenticated");
  }
  return withRateLimit(
    async () => {
      const body = (await request.json()) as CreatePostRequest;
      const post = await createPost({
        userId: session.user.id,
        title: body.title,
        content: body.content,
      });
      return NextResponse.json(post);
    },
    RATE_LIMITS.CREATE_POST
  );
}
