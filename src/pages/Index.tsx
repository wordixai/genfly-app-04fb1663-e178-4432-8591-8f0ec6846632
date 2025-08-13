import { useState } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectDialog } from '@/components/ProjectDialog';
import { ProjectDetails } from '@/components/ProjectDetails';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/project';
import { Plus, Search, Hammer, Wrench, Home, TreePine, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const { projects } = useProjectStore();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Project statistics
  const totalProjects = projects.length;
  const inProgressProjects = projects.filter(p => p.status === 'in-progress').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

  const handleCreateProject = () => {
    setEditingProject(undefined);
    setDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  // If viewing a specific project, show project details
  if (selectedProject) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <ProjectDetails
            project={selectedProject}
            onBack={handleBackToProjects}
            onEdit={() => handleEditProject(selectedProject)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-full">
                <Hammer className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">DIY Project Hub</h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              Plan, track, and complete your home improvement projects with confidence
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-8"
              onClick={handleCreateProject}
            >
              <Plus className="h-5 w-5 mr-2" />
              Start New Project
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="gradient-card p-6 rounded-lg text-center project-shadow">
            <div className="flex justify-center mb-2">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <div className="text-3xl font-bold">{totalProjects}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </div>
          
          <div className="gradient-card p-6 rounded-lg text-center project-shadow">
            <div className="flex justify-center mb-2">
              <Wrench className="h-8 w-8 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-500">{inProgressProjects}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
          
          <div className="gradient-card p-6 rounded-lg text-center project-shadow">
            <div className="flex justify-center mb-2">
              <Home className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-500">{completedProjects}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          
          <div className="gradient-card p-6 rounded-lg text-center project-shadow">
            <div className="flex justify-center mb-2">
              <TreePine className="h-8 w-8 text-accent" />
            </div>
            <div className="text-3xl font-bold text-accent">${totalBudget}</div>
            <div className="text-sm text-muted-foreground">Total Budget</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="renovation">Renovation</SelectItem>
              <SelectItem value="outdoor">Outdoor</SelectItem>
              <SelectItem value="repair">Repair</SelectItem>
              <SelectItem value="craft">Craft</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleCreateProject}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Active Filters */}
        {(statusFilter !== 'all' || categoryFilter !== 'all' || searchTerm) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="ml-1">
                  ×
                </button>
              </Badge>
            )}
            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('all')} className="ml-1">
                  ×
                </button>
              </Badge>
            )}
            {categoryFilter !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {categoryFilter}
                <button onClick={() => setCategoryFilter('all')} className="ml-1">
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="flex justify-center mb-4">
                <Hammer className="h-16 w-16 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {projects.length === 0 ? 'No projects yet' : 'No projects match your filters'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {projects.length === 0 
                  ? 'Start building something amazing! Create your first DIY project.'
                  : 'Try adjusting your search criteria or filters.'
                }
              </p>
              {projects.length === 0 && (
                <Button onClick={handleCreateProject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              )}
            </div>
          ) : (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onView={handleViewProject}
                onEdit={handleEditProject}
              />
            ))
          )}
        </div>
      </div>

      {/* Project Dialog */}
      <ProjectDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingProject(undefined);
        }}
        project={editingProject}
        mode={editingProject ? 'edit' : 'create'}
      />
    </div>
  );
};

export default Index;