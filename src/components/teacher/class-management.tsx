'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Mail, Trash2, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import axios from 'axios';

interface StudentClass {
  id: number;
  name: string;
  description: string;
  language: 'de' | 'en';
  age_range: string;
  student_count: number;
  createdAt: string;
}

interface Student {
  id: number;
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
  const [students, setStudents] = useState<Student[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState('');

  const { toast } = useToast();

  const [newClass, setNewClass] = useState({
    name: '',
    description: '',
    language: 'de' as 'de' | 'en',
    age_range: ''
  });

  const fetchClasses = useCallback(async () => {
    try {
      const response = await axios.get('/classes/teacher');
      setClasses(response.data.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Klassen konnten nicht geladen werden.'
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const fetchClassDetails = async (classId: number) => {
    try {
      const response = await axios.get(`/classes/${classId}`);
      setSelectedClass(response.data.class);
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching class details:', error);
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Klassendetails konnten nicht geladen werden.'
      });
    }
  };

  const createClass = async () => {
    if (!newClass.name || !newClass.language) {
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Name und Sprache sind erforderlich.'
      });
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/classes', newClass);
      toast({
        title: 'Erfolg',
        description: 'Klasse wurde erfolgreich erstellt.'
      });
      setIsCreateDialogOpen(false);
      setNewClass({ name: '', description: '', language: 'de', age_range: '' });
      fetchClasses();
    } catch (error) {
      console.error('Error creating class:', error);
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Klasse konnte nicht erstellt werden.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addStudentToClass = async () => {
    if (!selectedClass || !newStudentEmail) return;

    setIsLoading(true);
    try {
      await axios.post(`/classes/${selectedClass.id}/students`, {
        studentEmail: newStudentEmail
      });
      toast({
        title: 'Erfolg',
        description: 'Schüler wurde zur Klasse hinzugefügt.'
      });
      setIsAddStudentDialogOpen(false);
      setNewStudentEmail('');
      fetchClassDetails(selectedClass.id);
    } catch (error: unknown) {
      console.error('Error adding student:', error);
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Schüler konnte nicht hinzugefügt werden.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeStudentFromClass = async (studentId: number) => {
    if (!selectedClass) return;

    try {
      await axios.delete(`/classes/${selectedClass.id}/students/${studentId}`);
      toast({
        title: 'Erfolg',
        description: 'Schüler wurde aus der Klasse entfernt.'
      });
      fetchClassDetails(selectedClass.id);
    } catch (error) {
      console.error('Error removing student:', error);
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Schüler konnte nicht entfernt werden.'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Klassenverwaltung</h2>
          <p className="text-muted-foreground">Verwalten Sie Ihre Schülerklassen und weisen Sie Herausforderungen zu.</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Neue Klasse
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neue Klasse erstellen</DialogTitle>
              <DialogDescription>
                Erstellen Sie eine neue Schülerklasse für Ihre Herausforderungen.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Klassenname</label>
                <Input
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  placeholder="z.B. Klasse 3A"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Beschreibung</label>
                <Textarea
                  value={newClass.description}
                  onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                  placeholder="Beschreibung der Klasse..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Sprache</label>
                <Select value={newClass.language} onValueChange={(value: 'de' | 'en') => setNewClass({ ...newClass, language: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="en">Englisch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Altersbereich</label>
                <Select value={newClass.age_range} onValueChange={(value) => setNewClass({ ...newClass, age_range: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Altersbereich wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5-6">5-6 Jahre</SelectItem>
                    <SelectItem value="7-8">7-8 Jahre</SelectItem>
                    <SelectItem value="9-10">9-10 Jahre</SelectItem>
                    <SelectItem value="11-12">11-12 Jahre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={createClass} disabled={isLoading}>
                Klasse erstellen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Card key={cls.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => fetchClassDetails(cls.id)}>
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
                <span>Sprache: {cls.language === 'de' ? 'Deutsch' : 'Englisch'}</span>
                {cls.age_range && <span>Alter: {cls.age_range}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedClass && (
        <Card>
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
                    Schüler hinzufügen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schüler zur Klasse hinzufügen</DialogTitle>
                    <DialogDescription>
                      Geben Sie die E-Mail-Adresse des Schülers ein.
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <Input
                      type="email"
                      value={newStudentEmail}
                      onChange={(e) => setNewStudentEmail(e.target.value)}
                      placeholder="schueler@example.com"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddStudentDialogOpen(false)}>
                      Abbrechen
                    </Button>
                    <Button onClick={addStudentToClass} disabled={isLoading}>
                      Hinzufügen
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h4 className="font-semibold">Schüler ({students.length})</h4>
              {students.length === 0 ? (
                <p className="text-muted-foreground">Noch keine Schüler in dieser Klasse.</p>
              ) : (
                <div className="space-y-2">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
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
                          {student.total_challenge_points} Punkte
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStudentFromClass(student.id)}
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