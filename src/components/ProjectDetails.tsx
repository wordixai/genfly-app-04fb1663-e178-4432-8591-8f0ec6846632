import { Project } from '@/types/project';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MaterialsList } from './MaterialsList';
import { StepsList } from './StepsList';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  ExternalLink, 
  ArrowLeft,
  Edit,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectDetailsProps {
  project: Project;
  onBack: () => void;
  onEdit: () => void;
}

const getDifficultyColor = (difficulty: Project['difficulty']) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'planning': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'paused': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const ProjectDetails = ({ project, onBack, onEdit }: ProjectDetailsProps) => {
  const completedSteps = project.steps.filter(step => step.completed).length;
  const totalSteps = project.steps.length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  
  const purchasedMaterials = project.materials.filter(m => m.purchased).length;
  const totalMaterials = project.materials.length;
  
  const totalMaterialCost = project.materials.reduce((sum, m) => sum + (m.cost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        <div className="flex-1" />
        <Button onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Project
        </Button>
      </div>

      {/* Project Hero */}
      <Card className="overflow-hidden">
        <div className="md:flex">
          {project.imageUrl && (
            <div className="md:w-1/3">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">{project.title}</h1>
                  <p className="text-lg text-muted-foreground">{project.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={cn('border', getDifficultyColor(project.difficulty))}>
                    {project.difficulty}
                  </Badge>
                  <Badge className={cn('border', getStatusColor(project.status))}>
                    {project.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <div className="font-semibold">{project.estimatedTime}h</div>
                  <div className="text-xs text-muted-foreground">Estimated</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Calendar className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <div className="font-semibold capitalize">{project.category}</div>
                  <div className="text-xs text-muted-foreground">Category</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <DollarSign className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <div className="font-semibold">${project.budget || 0}</div>
                  <div className="text-xs text-muted-foreground">Budget</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <div className="font-semibold">{Math.round(progress)}%</div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </div>
              
              {project.tutorialUrl && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(project.tutorialUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Tutorial
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Project Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Steps Completed</span>
                <span className="font-medium">{completedSteps}/{totalSteps}</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Materials Purchased</span>
                <span className="font-medium">{purchasedMaterials}/{totalMaterials}</span>
              </div>
              <Progress 
                value={totalMaterials > 0 ? (purchasedMaterials / totalMaterials) * 100 : 0} 
                className="h-3" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Budget Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Budget</span>
                <span className="font-medium">${project.budget || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Material Cost</span>
                <span className="font-medium">${totalMaterialCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Actual Cost</span>
                <span className="font-medium">${project.actualCost || 0}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Remaining</span>
                <span className={cn(
                  (project.budget || 0) - totalMaterialCost >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                )}>
                  ${(project.budget || 0) - totalMaterialCost}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="materials" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="materials">
          <MaterialsList projectId={project.id} materials={project.materials} />
        </TabsContent>
        
        <TabsContent value="steps">
          <StepsList projectId={project.id} steps={project.steps} />
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.notes ? (
                <div className="whitespace-pre-wrap text-sm">{project.notes}</div>
              ) : (
                <div className="text-muted-foreground italic">No notes added yet.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};