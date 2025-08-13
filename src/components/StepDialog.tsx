import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProjectStep } from '@/types/project';
import { useState } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface StepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  step?: ProjectStep;
  mode: 'create' | 'edit';
  nextOrder: number;
}

export const StepDialog = ({ open, onOpenChange, projectId, step, mode, nextOrder }: StepDialogProps) => {
  const { addStep, updateStep } = useProjectStore();
  
  const [formData, setFormData] = useState({
    title: step?.title || '',
    description: step?.description || '',
    duration: step?.duration || 30,
    completed: step?.completed || false,
    tools: step?.tools || [],
    order: step?.order || nextOrder,
  });

  const [newTool, setNewTool] = useState('');

  const handleSubmit = () => {
    if (mode === 'create') {
      addStep(projectId, formData);
    } else if (step) {
      updateStep(projectId, step.id, formData);
    }
    onOpenChange(false);
    setFormData({
      title: '',
      description: '',
      duration: 30,
      completed: false,
      tools: [],
      order: nextOrder,
    });
    setNewTool('');
  };

  const addTool = () => {
    if (newTool.trim() && !formData.tools.includes(newTool.trim())) {
      setFormData({
        ...formData,
        tools: [...formData.tools, newTool.trim()]
      });
      setNewTool('');
    }
  };

  const removeTool = (tool: string) => {
    setFormData({
      ...formData,
      tools: formData.tools.filter(t => t !== tool)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTool();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add Step' : 'Edit Step'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Step Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Cut lumber to size"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed instructions for this step"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                min={1}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="order">Step Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                min={1}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="tools">Required Tools</Label>
            <div className="flex gap-2">
              <Input
                id="tools"
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                placeholder="e.g., circular saw, drill"
                onKeyPress={handleKeyPress}
              />
              <Button type="button" onClick={addTool} disabled={!newTool.trim()}>
                Add
              </Button>
            </div>
            
            {formData.tools.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tools.map((tool) => (
                  <Badge key={tool} variant="secondary" className="flex items-center gap-1">
                    {tool}
                    <button
                      type="button"
                      onClick={() => removeTool(tool)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.title.trim()}>
            {mode === 'create' ? 'Add Step' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};