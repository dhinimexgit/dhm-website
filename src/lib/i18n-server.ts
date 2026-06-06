import { cookies } from "next/headers";
import { translations, Language } from "@/data/translations";

export async function getTranslation(): Promise<{
  t: (typeof translations)[Language];
  lang: Language;
}> {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value as Language | undefined;
  const lang: Language = locale === 'kh' ? 'kh' : 'en';
  return {
    t: translations[lang],
    lang
  };
}
