import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-xl font-semibold">
        페이지를 찾을 수 없습니다
      </h2>
      <Link
        href="/"
        className="text-primary underline underline-offset-4"
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}
