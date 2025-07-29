import { eq } from "drizzle-orm";
import { getDB } from "./index";
import { userTable } from "./schema";

export async function findUserByEmail(email: string) {
  const db = getDB();
  return db.query.userTable.findFirst({
    where: eq(userTable.email, email),
  });
}

export async function createUser(data: {
  email: string;
  firstName?: string | null;
  nickname?: string | null;
  lastName?: string | null;
  passwordHash: string;
  signUpIpAddress?: string | null;
}) {
  const db = getDB();
  const [user] = await db.insert(userTable).values(data).returning();
  return user;
}
