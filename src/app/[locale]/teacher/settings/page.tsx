'use client';

import { useTranslation } from "@/contexts/locale-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function TeacherSettings() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('teacher.settings.title')}</h1>
      <p className="text-muted-foreground">{t('teacher.settings.description')}</p>
      <Card>
        <CardHeader>
          <CardTitle>{t('teacher.settings.profile')}</CardTitle>
          <CardDescription>{t('teacher.settings.profileDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t('teacher.settings.name')}</Label>
            <Input id="name" defaultValue={user?.name} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{t('teacher.settings.email')}</Label>
            <Input id="email" type="email" defaultValue={user?.email} disabled />
          </div>
          <Button>{t('teacher.settings.saveChanges')}</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('teacher.settings.password')}</CardTitle>
          <CardDescription>{t('teacher.settings.passwordDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="current-password">{t('teacher.settings.currentPassword')}</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">{t('teacher.settings.newPassword')}</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">{t('teacher.settings.confirmNewPassword')}</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button>{t('teacher.settings.changePassword')}</Button>
        </CardContent>
      </Card>
    </div>
  );
}