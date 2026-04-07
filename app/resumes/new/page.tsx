import { getTranslations } from "next-intl/server";
import { ResumeForm } from "./resume-form";

export default async function NewResumePage() {
  const t = await getTranslations("resume");

  return (
    <main className="mx-auto w-full max-w-2xl p-8">
      <h1 className="mb-8 text-2xl font-bold">{t("newResume")}</h1>
      <ResumeForm />
    </main>
  );
}
