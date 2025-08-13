import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Project } from '@/types/project';
import { Calendar, Clock, DollarSign, ExternalLink, Eye, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
}

const getDifficultyColor = (difficulty: Project['difficulty']) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'advanced':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'planning':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in-progress':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'paused':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const ProjectCard = ({ project, onView, onEdit }: ProjectCardProps) => {
  const completedSteps = project.steps.filter(step => step.completed).length;
  const totalSteps = project.steps.length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  
  const purchasedMaterials = project.materials.filter(m => m.purchased).length;
  const totalMaterials = project.materials.length;

  return (
    <Card className="project-shadow hover:shadow-xl transition-all duration-300 group h-full">
      {project.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <Badge className={cn('border', getDifficultyColor(project.difficulty))}>
              {project.difficulty}
            </Badge>
            <Badge className={cn('border', getStatusColor(project.status))}>
              {project.status}
            </Badge>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {project.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {project.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{project.estimatedTime}h</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="capitalize">{project.category}</span>
          </div>
          {project.budget && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>${project.budget}</span>
            </div>
          )}
        </div>
        
        {totalSteps > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{completedSteps}/{totalSteps} steps</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {totalMaterials > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Materials</span>
            <span className="font-medium">{purchasedMaterials}/{totalMaterials} purchased</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-3 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onView(project)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(project)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        {project.tutorialUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="px-3"
            onClick={() => window.open(project.tutorialUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};