'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Mail, Trash2, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/locale-context';

import axios from 'axios';

interface StudentClass {
  _id: string;
  name: string;
  description: string;
  language: 'de' | 'en';
  age_range: string;
  student_count: number;
  createdAt: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  avatarUrl: string;
  points: number;
  total_challenge_points: number;
  joinedAt: string;
}

export function ClassManagement() {
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<StudentClass | null>(null);
  const selectedClassCardRef = useRef<HTMLDivElement | null>(null);
  // Scroll to the selected class card when it appears
  useEffect(() => {
    if (selectedClass && selectedClassCardRef.current) {
      selectedClassCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedClass]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState('');

  const { toast } = useToast();
  const { t } = useTranslation();

  const [newClass, setNewClass] = useState({
    name: '',
    description: '',
    language: 'de' as 'de' | 'en',
    age_range: ''
  });

  const fetchClasses = useCallback(async () => {
    try {
      const response = await axios.get('/classes/teacher');
      console.log('API response for classes:', response.data.classes);
      setClasses(response.data.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('classManagement.errorCreate') // Using a generic error for loading too or add loadError key
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const fetchClassDetails = async (classId: string) => {
    try {
      const response = await axios.get(`/classes/${classId}`);
      setSelectedClass(response.data.class);
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching class details:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('classManagement.errorCreate') // Reusing error key or add specific one
      });
    }
  };

  const createClass = async () => {
    if (!newClass.name || !newClass.language) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('classManagement.errorCreate')
      });
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/classes', newClass);
      toast({
        title: t('common.success'),
        description: t('classManagement.successCreate')
      });
      setIsCreateDialogOpen(false);
      setNewClass({ name: '', description: '', language: 'de', age_range: '' });
      fetchClasses();
    } catch (error) {
      console.error('Error creating class:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('classManagement.errorCreate')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addStudentToClass = async () => {
    if (!selectedClass || !newStudentEmail) return;

    setIsLoading(true);
    try {
      await axios.post(`/classes/${selectedClass._id}/students`, {
        studentEmail: newStudentEmail
      });
      toast({
        title: t('common.success'),
        description: t('classManagement.successAdd')
      });
      setIsAddStudentDialogOpen(false);
      setNewStudentEmail('');
      fetchClassDetails(selectedClass._id);
    } catch (error: unknown) {
      console.error('Error adding student:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: (error as { response?: { data?: { message?: string } } })?.response?.data?.message || t('classManagement.errorAdd')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeStudentFromClass = async (studentId: string) => {
    if (!selectedClass) return;

    try {
      await axios.delete(`/classes/${selectedClass._id}/students/${studentId}`);
      toast({
        title: t('common.success'),
        description: t('classManagement.successRemove')
      });
      fetchClassDetails(selectedClass._id);
    } catch (error) {
      console.error('Error removing student:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('classManagement.errorRemove')
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('classManagement.title')}</h2>
          <p className="text-muted-foreground">{t('classManagement.description')}</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('classManagement.newClass')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('classManagement.createClassTitle')}</DialogTitle>
              <DialogDescription>
                {t('classManagement.createClassDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t('classManagement.className')}</label>
                <Input
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  placeholder="z.B. Klasse 3A"
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t('classManagement.classDescription')}</label>
                <Textarea
                  value={newClass.description}
                  onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                  placeholder="Beschreibung der Klasse..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t('classManagement.language')}</label>
                <Select value={newClass.language} onValueChange={(value: 'de' | 'en') => setNewClass({ ...newClass, language: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="de">{t('createChallengeForm.languageGerman')}</SelectItem>
                    <SelectItem value="en">{t('createChallengeForm.languageEnglish')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">{t('classManagement.ageRange')}</label>
                <Select value={newClass.age_range} onValueChange={(value) => setNewClass({ ...newClass, age_range: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('classManagement.selectAgeRange')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5-6">{t('createChallengeForm.ageRange5_6')}</SelectItem>
                    <SelectItem value="7-8">{t('createChallengeForm.ageRange7_8')}</SelectItem>
                    <SelectItem value="9-10">{t('createChallengeForm.ageRange9_10')}</SelectItem>
                    <SelectItem value="11-12">{t('createChallengeForm.ageRange11_12')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={createClass} disabled={isLoading}>
                {t('classManagement.createButton')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Card key={cls._id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => fetchClassDetails(cls._id)}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{cls.name}</span>
                <Badge variant="secondary">
                  <Users className="mr-1 h-3 w-3" />
                  {cls.student_count}
                </Badge>
              </CardTitle>
              <CardDescription>{cls.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t('classManagement.language')}: {cls.language === 'de' ? t('createChallengeForm.languageGerman') : t('createChallengeForm.languageEnglish')}</span>
                {cls.age_range && <span>{t('classManagement.ageRange')}: {cls.age_range}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedClass && (
        <Card ref={selectedClassCardRef}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{selectedClass.name}</CardTitle>
                <CardDescription>{selectedClass.description}</CardDescription>
              </div>
              <Dialog open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    {t('classManagement.addStudent')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('classManagement.addStudentTitle')}</DialogTitle>
                    <DialogDescription>
                      {t('classManagement.addStudentDescription')}
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <Input
                      type="email"
                      value={newStudentEmail}
                      onChange={(e) => setNewStudentEmail(e.target.value)}
                      placeholder={t('classManagement.enterEmail')}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddStudentDialogOpen(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button onClick={addStudentToClass} disabled={isLoading}>
                      {t('classManagement.addButton')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h4 className="font-semibold">{t('classManagement.students')} ({students.length})</h4>
              {students.length === 0 ? (
                <p className="text-muted-foreground">{t('classManagement.noStudents')}</p>
              ) : (
                <div className="space-y-2">
                  {students.map((student) => (
                    <div key={student._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={student.avatarUrl}
                          alt={student.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          <Trophy className="mr-1 h-3 w-3" />
                          {student.total_challenge_points} {t('common.points')}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStudentFromClass(student._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}