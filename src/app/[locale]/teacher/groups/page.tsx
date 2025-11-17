
'use client';

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateClassForm } from "@/components/teacher/create-class-form";

interface StudentClass {
  _id: string;
  name: string;
  language: string;
  ageRange: string;
  students: Array<{_id: string; name: string}>;
}

export default function StudentGroupsPage() {
  const { api } = useAuth();
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const fetchClasses = useCallback(async () => {
    try {
      const response = await api.get("/classes/teacher");
      setClasses(response.data);
    } catch {
      setError("Failed to load classes. Please try again later.");
    }
    setLoading(false);
  }, [api]);

  useEffect(() => {
    fetchClasses();
  }, [api, fetchClasses]);

  const handleClassCreated = () => {
    setCreateDialogOpen(false);
    setLoading(true);
    fetchClasses();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Student Groups</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new class</DialogTitle>
            </DialogHeader>
            <CreateClassForm onSuccess={handleClassCreated} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => (
            <Card key={c._id}>
              <CardHeader>
                <CardTitle>{c.name}</CardTitle>
                <CardDescription>
                  {c.language} - Ages {c.ageRange}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{c.students.length} students</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
