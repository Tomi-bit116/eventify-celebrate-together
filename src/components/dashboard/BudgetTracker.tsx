
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Plus, Trash2 } from 'lucide-react';

interface BudgetTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: any;
}

interface BudgetItem {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
}

export const BudgetTracker = ({ isOpen, onClose, eventData }: BudgetTrackerProps) => {
  const [totalBudget, setTotalBudget] = useState(1000);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: '1', category: 'Venue', budgeted: 500, spent: 0 },
    { id: '2', category: 'Food & Drinks', budgeted: 300, spent: 0 },
    { id: '3', category: 'Decorations', budgeted: 100, spent: 0 },
    { id: '4', category: 'Entertainment', budgeted: 100, spent: 0 }
  ]);

  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0);
  const totalBudgeted = budgetItems.reduce((sum, item) => sum + item.budgeted, 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetProgress = (totalSpent / totalBudget) * 100;

  const addBudgetItem = () => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      category: '',
      budgeted: 0,
      spent: 0
    };
    setBudgetItems([...budgetItems, newItem]);
  };

  const updateBudgetItem = (id: string, field: keyof BudgetItem, value: string | number) => {
    setBudgetItems(items =>
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItems(items => items.filter(item => item.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
            Budget Tracker 💰
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Budget Overview */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Total Budget</Label>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <Input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="w-24"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Remaining</Label>
                <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  ${remainingBudget}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Spent: ${totalSpent}</span>
                <span>{budgetProgress.toFixed(1)}%</span>
              </div>
              <Progress 
                value={budgetProgress} 
                className={budgetProgress > 100 ? 'bg-red-100' : 'bg-emerald-100'}
              />
            </div>
          </div>

          {/* Budget Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Budget Categories</h3>
              <Button
                onClick={addBudgetItem}
                variant="outline"
                size="sm"
                className="border-dashed"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Category
              </Button>
            </div>

            {budgetItems.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-3 items-center p-4 bg-gray-50 rounded-lg">
                <div className="col-span-4">
                  <Input
                    placeholder="Category name"
                    value={item.category}
                    onChange={(e) => updateBudgetItem(item.id, 'category', e.target.value)}
                  />
                </div>
                <div className="col-span-3">
                  <Label className="text-xs text-gray-600">Budgeted</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={item.budgeted}
                    onChange={(e) => updateBudgetItem(item.id, 'budgeted', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-3">
                  <Label className="text-xs text-gray-600">Spent</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={item.spent}
                    onChange={(e) => updateBudgetItem(item.id, 'spent', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-1">
                  <span className={`text-sm font-medium ${
                    item.spent > item.budgeted ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    ${item.budgeted - item.spent}
                  </span>
                </div>
                <div className="col-span-1">
                  <Button
                    onClick={() => removeBudgetItem(item.id)}
                    variant="ghost"
                    size="sm"
                    className="p-1"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              onClick={onClose}
            >
              Save Budget
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
