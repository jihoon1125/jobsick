import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  // TODO: implement job posting crawl
  return NextResponse.json(
    { message: "not implemented", input: body },
    { status: 501 }
  );
}
