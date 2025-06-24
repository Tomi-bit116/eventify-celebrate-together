
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, DollarSign, TrendingUp, PieChart, Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

interface BudgetPageProps {
  onBack: () => void;
}

export const BudgetPage = ({ onBack }: BudgetPageProps) => {
  const [totalBudget, setTotalBudget] = useState(500000);
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: '1', name: 'Food & Catering', allocated: 200000, spent: 150000, color: 'bg-green-500' },
    { id: '2', name: 'Venue', allocated: 150000, spent: 150000, color: 'bg-blue-500' },
    { id: '3', name: 'Decoration', allocated: 80000, spent: 45000, color: 'bg-purple-500' },
    { id: '4', name: 'Entertainment', allocated: 50000, spent: 0, color: 'bg-yellow-500' },
    { id: '5', name: 'Transportation', allocated: 20000, spent: 10000, color: 'bg-red-500' },
  ]);
  const [newCategory, setNewCategory] = useState({ name: '', allocated: 0 });

  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const remaining = totalBudget - totalSpent;

  const handleAddCategory = () => {
    if (!newCategory.name || newCategory.allocated <= 0) {
      toast.error("Please enter category name and budget amount!");
      return;
    }

    const category: BudgetCategory = {
      id: Date.now().toString(),
      name: newCategory.name,
      allocated: newCategory.allocated,
      spent: 0,
      color: 'bg-indigo-500'
    };

    setCategories([...categories, category]);
    setNewCategory({ name: '', allocated: 0 });
    toast.success(`${newCategory.name} category added! 💰`);
  };

  const updateSpent = (id: string, amount: number) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, spent: Math.max(0, amount) } : cat
    ));
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    toast.success("Category removed!");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button onClick={onBack} variant="ghost" className="mr-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
              <DollarSign className="w-8 h-8 mr-3 text-green-600" />
              Budget Tracker 💰
            </h1>
            <p className="text-gray-600 mt-2">Keep your celebration budget on track!</p>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">💸</div>
              <h3 className="font-semibold text-gray-600">Total Budget</h3>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalBudget)}</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">💳</div>
              <h3 className="font-semibold text-gray-600">Total Spent</h3>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSpent)}</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-semibold text-gray-600">Remaining</h3>
              <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(remaining)}
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold text-gray-600">Budget Used</h3>
              <p className="text-2xl font-bold text-purple-600">
                {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Budget Categories */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Budget Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => {
                    const percentage = category.allocated > 0 ? (category.spent / category.allocated) * 100 : 0;
                    return (
                      <div key={category.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-gray-800">{category.name}</h4>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeCategory(category.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Spent: {formatCurrency(category.spent)}</span>
                          <span>Budget: {formatCurrency(category.allocated)}</span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                          <div
                            className={`h-3 rounded-full ${category.color} transition-all duration-300`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            placeholder="Enter amount spent"
                            value={category.spent || ''}
                            onChange={(e) => updateSpent(category.id, parseFloat(e.target.value) || 0)}
                            className="text-sm"
                          />
                          <span className="text-sm text-gray-500">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add New Category & Budget Settings */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Category
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    placeholder="e.g., Photography"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="categoryBudget">Budget Amount (₦)</Label>
                  <Input
                    id="categoryBudget"
                    type="number"
                    placeholder="50000"
                    value={newCategory.allocated || ''}
                    onChange={(e) => setNewCategory({...newCategory, allocated: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <Button onClick={handleAddCategory} className="w-full bg-green-600 hover:bg-green-700">
                  Add Category 🎯
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <Edit2 className="w-5 h-5 mr-2" />
                  Total Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="totalBudget">Total Event Budget (₦)</Label>
                  <Input
                    id="totalBudget"
                    type="number"
                    value={totalBudget || ''}
                    onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                  />
                  <div className="text-sm text-gray-600">
                    <p>Allocated: {formatCurrency(totalAllocated)}</p>
                    <p>Unallocated: {formatCurrency(totalBudget - totalAllocated)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
