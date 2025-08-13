import { ProjectStep } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useProjectStore } from '@/store/useProjectStore';
import { StepDialog } from './StepDialog';
import { useState } from 'react';
import { Plus, Clock, CheckCircle2, Trash2, Edit, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepsListProps {
  projectId: string;
  steps: ProjectStep[];
}

export const StepsList = ({ projectId, steps }: StepsListProps) => {
  const { toggleStepComplete, deleteStep } = useProjectStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<ProjectStep | undefined>();

  const handleToggleComplete = (stepId: string) => {
    toggleStepComplete(projectId, stepId);
  };

  const handleEdit = (step: ProjectStep) => {
    setEditingStep(step);
    setDialogOpen(true);
  };

  const handleDelete = (stepId: string) => {
    deleteStep(projectId, stepId);
  };

  const completedSteps = steps.filter(s => s.completed).length;
  const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);
  const completedDuration = steps.filter(s => s.completed).reduce((sum, s) => sum + s.duration, 0);

  // Sort steps by order
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Project Steps
          </CardTitle>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </CardHeader>
        <CardContent>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{completedSteps}/{steps.length}</div>
              <div className="text-sm text-muted-foreground">Steps Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(completedDuration / 60)}h</div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(totalDuration / 60)}h</div>
              <div className="text-sm text-muted-foreground">Total Time</div>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {steps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No steps added yet. Click "Add Step" to create your project plan.
              </div>
            ) : (
              sortedSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-start gap-4 p-4 border rounded-lg transition-colors",
                    step.completed ? "bg-green-50 border-green-200" : "bg-background"
                  )}
                >
                  <div className="flex items-center gap-3 mt-1">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                      step.completed 
                        ? "bg-green-500 text-white" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {index + 1}
                    </div>
                    <Checkbox
                      checked={step.completed}
                      onCheckedChange={() => handleToggleComplete(step.id)}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn(
                        "font-medium",
                        step.completed && "line-through text-muted-foreground"
                      )}>
                        {step.title}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {step.duration}min
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {step.description}
                    </p>
                    
                    {step.tools.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Wrench className="h-3 w-3 text-muted-foreground" />
                        {step.tools.map((tool, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(step)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(step.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <StepDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingStep(undefined);
        }}
        projectId={projectId}
        step={editingStep}
        mode={editingStep ? 'edit' : 'create'}
        nextOrder={steps.length + 1}
      />
    </div>
  );
};