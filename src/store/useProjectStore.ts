import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, Material, ProjectStep } from '@/types/project';
import { v4 as uuidv4 } from 'uuid';

interface ProjectStore {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addMaterial: (projectId: string, material: Omit<Material, 'id'>) => void;
  updateMaterial: (projectId: string, materialId: string, updates: Partial<Material>) => void;
  deleteMaterial: (projectId: string, materialId: string) => void;
  addStep: (projectId: string, step: Omit<ProjectStep, 'id'>) => void;
  updateStep: (projectId: string, stepId: string, updates: Partial<ProjectStep>) => void;
  deleteStep: (projectId: string, stepId: string) => void;
  toggleStepComplete: (projectId: string, stepId: string) => void;
  getProject: (id: string) => Project | undefined;
}

const createMockProjects = (): Project[] => [
  {
    id: '1',
    title: 'Kitchen Cabinet Renovation',
    description: 'Complete kitchen cabinet makeover with new doors, hardware, and paint finish.',
    category: 'renovation',
    difficulty: 'intermediate',
    estimatedTime: 24,
    status: 'in-progress',
    startDate: '2024-01-15',
    budget: 800,
    actualCost: 650,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    tutorialUrl: 'https://example.com/cabinet-renovation',
    materials: [
      {
        id: '1',
        name: 'Cabinet Paint',
        quantity: 2,
        unit: 'gallons',
        cost: 120,
        purchased: true,
        category: 'materials',
        notes: 'Semi-gloss white finish'
      },
      {
        id: '2',
        name: 'Cabinet Hinges',
        quantity: 20,
        unit: 'pieces',
        cost: 80,
        purchased: true,
        category: 'hardware'
      }
    ],
    steps: [
      {
        id: '1',
        title: 'Remove cabinet doors',
        description: 'Carefully remove all cabinet doors and label them for reassembly',
        duration: 120,
        completed: true,
        tools: ['screwdriver', 'label maker'],
        order: 1
      },
      {
        id: '2',
        title: 'Sand surfaces',
        description: 'Sand all cabinet surfaces to prepare for painting',
        duration: 240,
        completed: true,
        tools: ['orbital sander', 'sandpaper'],
        order: 2
      }
    ],
    notes: 'Need to match existing countertop color',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z'
  },
  {
    id: '2',
    title: 'Garden Planter Box',
    description: 'Build a raised garden planter box for herbs and vegetables.',
    category: 'outdoor',
    difficulty: 'beginner',
    estimatedTime: 6,
    status: 'planning',
    budget: 150,
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    materials: [
      {
        id: '3',
        name: 'Cedar boards 2x8',
        quantity: 4,
        unit: 'pieces',
        cost: 60,
        purchased: false,
        category: 'lumber'
      }
    ],
    steps: [
      {
        id: '3',
        title: 'Cut lumber to size',
        description: 'Cut all boards to the required dimensions',
        duration: 45,
        completed: false,
        tools: ['circular saw', 'measuring tape'],
        order: 1
      }
    ],
    createdAt: '2024-01-12T09:15:00Z',
    updatedAt: '2024-01-12T09:15:00Z'
  }
];

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: createMockProjects(),
      
      addProject: (project) => {
        const newProject: Project = {
          ...project,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          projects: [...state.projects, newProject],
        }));
      },
      
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updates, updatedAt: new Date().toISOString() }
              : project
          ),
        }));
      },
      
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        }));
      },
      
      addMaterial: (projectId, material) => {
        const newMaterial: Material = {
          ...material,
          id: uuidv4(),
        };
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  materials: [...project.materials, newMaterial],
                  updatedAt: new Date().toISOString(),
                }
              : project
          ),
        }));
      },
      
      updateMaterial: (projectId, materialId, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  materials: project.materials.map((material) =>
                    material.id === materialId ? { ...material, ...updates } : material
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : project
          ),
        }));
      },
      
      deleteMaterial: (projectId, materialId) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  materials: project.materials.filter((material) => material.id !== materialId),
                  updatedAt: new Date().toISOString(),
                }
              : project
          ),
        }));
      },
      
      addStep: (projectId, step) => {
        const newStep: ProjectStep = {
          ...step,
          id: uuidv4(),
        };
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  steps: [...project.steps, newStep],
                  updatedAt: new Date().toISOString(),
                }
              : project
          ),
        }));
      },
      
      updateStep: (projectId, stepId, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  steps: project.steps.map((step) =>
                    step.id === stepId ? { ...step, ...updates } : step
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : project
          ),
        }));
      },
      
      deleteStep: (projectId, stepId) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  steps: project.steps.filter((step) => step.id !== stepId),
                  updatedAt: new Date().toISOString(),
                }
              : project
          ),
        }));
      },
      
      toggleStepComplete: (projectId, stepId) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  steps: project.steps.map((step) =>
                    step.id === stepId ? { ...step, completed: !step.completed } : step
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : project
          ),
        }));
      },
      
      getProject: (id) => {
        return get().projects.find((project) => project.id === id);
      },
    }),
    {
      name: 'diy-project-store',
    }
  )
);