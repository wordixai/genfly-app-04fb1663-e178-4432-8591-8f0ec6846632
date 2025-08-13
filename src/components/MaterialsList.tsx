import { Material } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useProjectStore } from '@/store/useProjectStore';
import { MaterialDialog } from './MaterialDialog';
import { useState } from 'react';
import { Plus, DollarSign, Package, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaterialsListProps {
  projectId: string;
  materials: Material[];
}

const getCategoryColor = (category: Material['category']) => {
  switch (category) {
    case 'lumber': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'hardware': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'tools': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'materials': return 'bg-green-100 text-green-800 border-green-200';
    case 'other': return 'bg-purple-100 text-purple-800 border-purple-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const MaterialsList = ({ projectId, materials }: MaterialsListProps) => {
  const { updateMaterial, deleteMaterial } = useProjectStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>();

  const handleTogglePurchased = (materialId: string, purchased: boolean) => {
    updateMaterial(projectId, materialId, { purchased: !purchased });
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setDialogOpen(true);
  };

  const handleDelete = (materialId: string) => {
    deleteMaterial(projectId, materialId);
  };

  const totalCost = materials.reduce((sum, m) => sum + (m.cost || 0), 0);
  const purchasedCost = materials
    .filter(m => m.purchased)
    .reduce((sum, m) => sum + (m.cost || 0), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Materials List
          </CardTitle>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Material
          </Button>
        </CardHeader>
        <CardContent>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{materials.length}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${purchasedCost}</div>
              <div className="text-sm text-muted-foreground">Purchased</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${totalCost}</div>
              <div className="text-sm text-muted-foreground">Total Cost</div>
            </div>
          </div>

          {/* Materials List */}
          <div className="space-y-3">
            {materials.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No materials added yet. Click "Add Material" to get started.
              </div>
            ) : (
              materials.map((material) => (
                <div
                  key={material.id}
                  className={cn(
                    "flex items-center gap-4 p-4 border rounded-lg transition-colors",
                    material.purchased ? "bg-green-50 border-green-200" : "bg-background"
                  )}
                >
                  <Checkbox
                    checked={material.purchased}
                    onCheckedChange={() => handleTogglePurchased(material.id, material.purchased)}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn(
                        "font-medium",
                        material.purchased && "line-through text-muted-foreground"
                      )}>
                        {material.name}
                      </h4>
                      <Badge className={cn('text-xs border', getCategoryColor(material.category))}>
                        {material.category}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {material.quantity} {material.unit}
                      {material.cost && (
                        <span className="ml-3 flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {material.cost}
                        </span>
                      )}
                    </div>
                    {material.notes && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {material.notes}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(material)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(material.id)}
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

      <MaterialDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingMaterial(undefined);
        }}
        projectId={projectId}
        material={editingMaterial}
        mode={editingMaterial ? 'edit' : 'create'}
      />
    </div>
  );
};