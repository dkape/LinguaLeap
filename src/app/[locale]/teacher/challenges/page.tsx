'use client';

import { useTranslation } from "@/contexts/locale-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TeacherChallenges() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('teacher.challenges.title')}</h1>
          <p className="text-muted-foreground">{t('teacher.challenges.description')}</p>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('teacher.challenges.createNew')}</CardTitle>
            <CardDescription>{t('teacher.challenges.createNewDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="topic">{t('teacher.challenges.topic')}</Label>
              <Input id="topic" placeholder={t('teacher.challenges.topicPlaceholder')} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{t('teacher.challenges.classDescription')}</Label>
              <Textarea id="description" placeholder={t('teacher.challenges.classDescriptionPlaceholder')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="age-range">{t('teacher.challenges.ageRange')}</Label>
                <Select>
                  <SelectTrigger id="age-range">
                    <SelectValue placeholder={t('teacher.challenges.selectAge')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5-6">5-6</SelectItem>
                    <SelectItem value="7-8">7-8</SelectItem>
                    <SelectItem value="9-10">9-10</SelectItem>
                    <SelectItem value="11-12">11-12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reading-level">{t('teacher.challenges.readingLevel')}</Label>
                <Select>
                  <SelectTrigger id="reading-level">
                    <SelectValue placeholder={t('teacher.challenges.selectLevel')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">{t('teacher.challenges.levels.beginner')}</SelectItem>
                    <SelectItem value="intermediate">{t('teacher.challenges.levels.intermediate')}</SelectItem>
                    <SelectItem value="advanced">{t('teacher.challenges.levels.advanced')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button>{t('teacher.challenges.generate')}</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('teacher.challenges.existing')}</CardTitle>
            <CardDescription>{t('teacher.challenges.existingDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-semibold">The Adventures of Tom Sawyer</p>
                <p className="text-sm text-muted-foreground">Age: 9-10, Intermediate</p>
              </div>
              <div>
                <Button variant="ghost" size="sm">{t('common.edit')}</Button>
                <Button variant="ghost" size="sm" className="text-red-500">{t('common.delete')}</Button>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-semibold">Alice in Wonderland</p>
                <p className="text-sm text-muted-foreground">Age: 7-8, Beginner</p>
              </div>
              <div>
                <Button variant="ghost" size="sm">{t('common.edit')}</Button>
                <Button variant="ghost" size="sm" className="text-red-500">{t('common.delete')}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}