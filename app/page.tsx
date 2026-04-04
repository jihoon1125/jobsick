export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">Jobsick</h1>
      <p className="max-w-md text-center text-muted-foreground">
        채용공고 URL 또는 텍스트를 입력하면 이력서 매칭, 회사 평판, 연봉
        적합도를 종합 분석해드립니다.
      </p>
    </main>
  );
}
