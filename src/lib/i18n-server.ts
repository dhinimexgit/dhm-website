import { cookies } from "next/headers";
import { translations, Language } from "@/data/translations";

export async function getTranslation() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value as Language | undefined;
  const lang = locale === 'kh' ? 'kh' : 'en';
  return {
    t: translations[lang],
    lang
  };
}
