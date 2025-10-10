import { getDictionary } from "../../get-dictionary";
import { Locale } from "../../i18n-config";

export default async function TeacherPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold">{dictionary.teacher.title}</h1>
        <p className="text-lg mt-2">{dictionary.teacher.description}</p>
      </div>
    </div>
  );
}