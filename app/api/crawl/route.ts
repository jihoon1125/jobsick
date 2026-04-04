import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body: unknown = await request.json();

  // TODO: 채용공고 크롤링 로직 구현
  return NextResponse.json(
    { message: "not implemented", input: body },
    { status: 501 }
  );
}
