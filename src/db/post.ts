import { getDB } from "./index";
import { postTable } from "./schema";
import { eq } from "drizzle-orm";

export async function getAllPosts() {
  const db = getDB();
  return db.select().from(postTable);
}

export async function createPost(data: {
  userId: string;
  title: string;
  content?: string | null;
}) {
  const db = getDB();
  const [post] = await db.insert(postTable).values(data).returning();
  return post;
}

export async function getPostById(id: string) {
  const db = getDB();
  return db.query.postTable.findFirst({ where: eq(postTable.id, id) });
}
