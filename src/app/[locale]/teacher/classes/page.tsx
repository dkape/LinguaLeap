'use client';

import { useTranslation } from "@/contexts/locale-context";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const classes = [
  {
    name: "Class 3A",
    students: [
      { name: "Alice", progress: "85%" },
      { name: "Bob", progress: "72%" },
      { name: "Charlie", progress: "91%" },
    ],
  },
  {
    name: "Class 4B",
    students: [
      { name: "David", progress: "65%" },
      { name: "Eve", progress: "88%" },
    ],
  },
];

export default function TeacherClasses() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('teacher.classes.title')}</h1>
          <p className="text-muted-foreground">{t('teacher.classes.description')}</p>
        </div>
        <Button>{t('teacher.classes.create')}</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-1">
        {classes.map((c, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{c.name}</CardTitle>
            </CardHeader>
            <div className="px-6 py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('teacher.classes.studentName')}</TableHead>
                    <TableHead>{t('teacher.classes.progress')}</TableHead>
                    <TableHead className="text-right">{t('teacher.classes.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {c.students.map((s, sIndex) => (
                    <TableRow key={sIndex}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.progress}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">{t('teacher.classes.view')}</Button>
                        <Button variant="ghost" size="sm" className="text-red-500">{t('teacher.classes.remove')}</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}