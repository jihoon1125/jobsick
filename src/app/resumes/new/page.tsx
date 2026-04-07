import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/common/page-container";
import { ResumeForm } from "./resume-form";

export default async function NewResumePage() {
  const t = await getTranslations("resume");

  return (
    <PageContainer title={t("newResume")}>
      <ResumeForm />
    </PageContainer>
  );
}
