import { NextResponse } from "next/server";
import { connectToDB } from "./../../../lib/dbConnect";

export async function GET() {
  await connectToDB();
  return NextResponse.json({ message: "done" });
}