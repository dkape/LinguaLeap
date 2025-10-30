'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

export function EditChallengeDialog({ challenge, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    title: challenge.title,
    description: challenge.description,
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put(`/challenges/${challenge._id}`, formData);
      toast({ title: 'Success', description: 'Challenge updated successfully' });
      onSaved();
    } catch (error) {
      console.error('Error updating challenge:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update challenge' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Challenge</DialogTitle>
          <DialogDescription>Make changes to your challenge here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label>Title</label>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div>
            <label>Description</label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
