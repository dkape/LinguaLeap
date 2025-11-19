'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from "@/contexts/locale-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import axios from 'axios';
import { CreateLearningPathForm } from "@/components/teacher/create-learning-path-form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface LearningPath {
  _id: string;
  title: string;
  description: string;
  isActive: boolean;
  ageRange: string;
  language: string;
}

export default function TeacherLearningPaths() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const fetchLearningPaths = async () => {
    try {
      const response = await axios.get('/learning-paths/teacher');
      setLearningPaths(response.data.learningPaths);
    } catch (error) {
      console.error('Error fetching learning paths:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLearningPaths();
  }, []);

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    fetchLearningPaths();
  };

  const toggleStatus = async (pathId: string, currentStatus: boolean) => {
    try {
      await axios.patch(`/learning-paths/${pathId}/toggle-status`);
      setLearningPaths(prev => prev.map(p => p._id === pathId ? { ...p, isActive: !currentStatus } : p));
      toast({
        title: t('common.success'),
        description: t('createChallengeForm.statusUpdateSuccessTitle') // Reusing generic success or status update key
      });
    } catch (error) {
      console.error('Error toggling status:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('createChallengeForm.statusUpdateErrorDescription')
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('teacher.learningPaths.title')}</h1>
          <p className="text-muted-foreground">{t('teacher.learningPaths.description')}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('teacher.learningPaths.createButton')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('teacher.create.cardTitle')}</DialogTitle>
              <DialogDescription>{t('teacher.create.cardDescription')}</DialogDescription>
            </DialogHeader>
            <CreateLearningPathForm onSuccess={handleCreateSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {learningPaths.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            {t('common.noResults')} {/* Or a more specific message if available */}
          </div>
        ) : (
          learningPaths.map((path) => (
            <Card key={path._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <Badge variant={path.isActive ? "default" : "secondary"}>
                    {path.isActive ? t('createChallengeForm.activate') : t('createChallengeForm.deactivate')} {/* Using activate/deactivate as status labels roughly */}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">{path.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{path.language === 'de' ? t('createChallengeForm.languageGerman') : t('createChallengeForm.languageEnglish')}</Badge>
                  <Badge variant="outline">{path.ageRange}</Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => toggleStatus(path._id, path.isActive)}>
                  {path.isActive ? t('createChallengeForm.deactivate') : t('createChallengeForm.activate')}
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}