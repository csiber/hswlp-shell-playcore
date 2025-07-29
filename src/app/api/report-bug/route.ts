import { NextResponse } from "next/server";
import { sendBugReportEmail } from "@/utils/email";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const email = String(formData.get("email") || "anonymous");
    const description = String(formData.get("description") || "");
    if (!description) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    let screenshotDataUrl: string | undefined;
    const file = formData.get("screenshot");
    if (file instanceof File && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const mime = file.type || "image/png";
      screenshotDataUrl = `data:${mime};base64,${base64}`;
    }

    await sendBugReportEmail({ reporterEmail: email, description, screenshotDataUrl });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send bug report" }, { status: 500 });
  }
}
