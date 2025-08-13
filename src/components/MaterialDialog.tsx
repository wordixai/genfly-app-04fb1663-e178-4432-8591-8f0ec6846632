import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Material } from '@/types/project';
import { useState } from 'react';
import { useProjectStore } from '@/store/useProjectStore';

interface MaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  material?: Material;
  mode: 'create' | 'edit';
}

export const MaterialDialog = ({ open, onOpenChange, projectId, material, mode }: MaterialDialogProps) => {
  const { addMaterial, updateMaterial } = useProjectStore();
  
  const [formData, setFormData] = useState({
    name: material?.name || '',
    quantity: material?.quantity || 1,
    unit: material?.unit || 'pieces',
    cost: material?.cost || 0,
    purchased: material?.purchased || false,
    category: material?.category || 'other',
    notes: material?.notes || '',
  });

  const handleSubmit = () => {
    if (mode === 'create') {
      addMaterial(projectId, formData);
    } else if (material) {
      updateMaterial(projectId, material.id, formData);
    }
    onOpenChange(false);
    setFormData({
      name: '',
      quantity: 1,
      unit: 'pieces',
      cost: 0,
      purchased: false,
      category: 'other',
      notes: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add Material' : 'Edit Material'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Material Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., 2x4 lumber, wood screws"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                min={1}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pieces">Pieces</SelectItem>
                  <SelectItem value="feet">Feet</SelectItem>
                  <SelectItem value="inches">Inches</SelectItem>
                  <SelectItem value="yards">Yards</SelectItem>
                  <SelectItem value="pounds">Pounds</SelectItem>
                  <SelectItem value="gallons">Gallons</SelectItem>
                  <SelectItem value="quarts">Quarts</SelectItem>
                  <SelectItem value="boxes">Boxes</SelectItem>
                  <SelectItem value="packs">Packs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cost">Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                min={0}
                step={0.01}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as Material['category'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lumber">Lumber</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                  <SelectItem value="materials">Materials</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="purchased"
              checked={formData.purchased}
              onCheckedChange={(checked) => setFormData({ ...formData, purchased: !!checked })}
            />
            <Label htmlFor="purchased">Already purchased</Label>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this material"
              rows={2}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
            {mode === 'create' ? 'Add Material' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};