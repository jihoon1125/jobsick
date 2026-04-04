export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">
          대시보드
        </h1>
      </header>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
