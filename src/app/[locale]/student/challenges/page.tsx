'use client';

import { useTranslation } from "@/contexts/locale-context";
import { ChallengeList } from "@/components/student/challenge-list";

export default function StudentChallenges() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('challenges.title')}</h1>
      <p className="text-muted-foreground">{t('challenges.solveChallengesDescription')}</p>
      <ChallengeList />
    </div>
  );
}