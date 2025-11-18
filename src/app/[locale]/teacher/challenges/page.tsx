'use client';

import { useTranslation } from "@/contexts/locale-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TeacherChallenges() {
  const { dict } = useTranslation();
  const t = (key: string) => {
    const keys = key.split('.');
    let result: any = dict;
    for (const k of keys) {
      result = result[k];
      if (typeof result === 'undefined') {
        return key;
      }
    }
    return result;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('challenges.title')}</h1>
          <p className="text-muted-foreground">{t('challenges.description')}</p>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create New Challenge</CardTitle>
            <CardDescription>Use AI to generate a new reading challenge.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" placeholder="e.g., The Solar System" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Class Description</Label>
              <Textarea id="description" placeholder="e.g., A class of 8-year-olds who love animals." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="age-range">Age Range</Label>
                <Select>
                  <SelectTrigger id="age-range">
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5-6">5-6 years</SelectItem>
                    <SelectItem value="7-8">7-8 years</SelectItem>
                    <SelectItem value="9-10">9-10 years</SelectItem>
                    <SelectItem value="11-12">11-12 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reading-level">Reading Level</Label>
                <Select>
                  <SelectTrigger id="reading-level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button>Generate Challenge</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Existing Challenges</CardTitle>
            <CardDescription>Manage your saved challenges.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-semibold">The Adventures of Tom Sawyer</p>
                <p className="text-sm text-muted-foreground">Age: 9-10, Intermediate</p>
              </div>
              <div>
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-semibold">Alice in Wonderland</p>
                <p className="text-sm text-muted-foreground">Age: 7-8, Beginner</p>
              </div>
              <div>
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}