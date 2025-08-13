export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost?: number;
  purchased: boolean;
  category: 'lumber' | 'hardware' | 'tools' | 'materials' | 'other';
  notes?: string;
}

export interface ProjectStep {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  completed: boolean;
  tools: string[];
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'furniture' | 'renovation' | 'outdoor' | 'repair' | 'craft' | 'other';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in hours
  status: 'planning' | 'in-progress' | 'completed' | 'paused';
  startDate?: string;
  endDate?: string;
  materials: Material[];
  steps: ProjectStep[];
  budget?: number;
  actualCost?: number;
  imageUrl?: string;
  tutorialUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}