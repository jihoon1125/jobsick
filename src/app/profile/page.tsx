import { useTranslations } from "next-intl";
import { ProfileForm } from "./profile-form";

export default function ProfilePage() {
  const t = useTranslations("profile");

  return (
    <main className="mx-auto w-full max-w-2xl p-8">
      <h1 className="mb-8 text-2xl font-bold">{t("title")}</h1>
      <ProfileForm />
    </main>
  );
}
