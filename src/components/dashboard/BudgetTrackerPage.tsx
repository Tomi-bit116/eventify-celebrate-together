
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, DollarSign, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface BudgetTrackerPageProps {
  onBack: () => void;
  currentEvent?: any;
}

interface BudgetItem {
  id: string;
  category: string;
  amount: number;
  description: string;
}

export const BudgetTrackerPage = ({ onBack, currentEvent }: BudgetTrackerPageProps) => {
  const [totalBudget, setTotalBudget] = useState(currentEvent?.budget || 0);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [newItem, setNewItem] = useState({
    category: '',
    amount: '',
    description: ''
  });

  const totalSpent = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = totalBudget - totalSpent;

  const handleAddItem = () => {
    if (!newItem.category || !newItem.amount) {
      toast.error('Please fill in category and amount');
      return;
    }

    const item: BudgetItem = {
      id: Date.now().toString(),
      category: newItem.category,
      amount: parseFloat(newItem.amount),
      description: newItem.description
    };

    setBudgetItems([...budgetItems, item]);
    setNewItem({ category: '', amount: '', description: '' });
    toast.success('Budget item added successfully!');
  };

  const handleDeleteItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
    toast.success('Budget item removed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-gold-50 p-4 font-montserrat">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button onClick={onBack} variant="ghost" className="mr-4 hover:bg-white/50">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <DollarSign className="w-8 h-8 mr-3 text-emerald-600" />
              Budget Tracker
            </h1>
            <p className="text-gray-600 mt-2">
              {currentEvent ? `Managing budget for ${currentEvent.name}` : 'Manage your event budget'}
            </p>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm border-0">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
              <h3 className="text-2xl font-bold text-gray-800">${totalBudget.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">Total Budget</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-white/90 backdrop-blur-sm border-0">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">-</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">${totalSpent.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">Total Spent</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-white/90 backdrop-blur-sm border-0">
            <CardContent className="p-6 text-center">
              <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                remainingBudget >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className={`font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {remainingBudget >= 0 ? '+' : '-'}
                </span>
              </div>
              <h3 className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(remainingBudget).toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600">
                {remainingBudget >= 0 ? 'Remaining' : 'Over Budget'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Set Budget */}
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm border-0 mb-6">
          <CardHeader>
            <CardTitle className="text-emerald-700">Set Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="totalBudget">Total Budget ($)</Label>
                <Input
                  id="totalBudget"
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                  placeholder="Enter total budget"
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={() => toast.success('Budget updated!')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Update Budget
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add New Budget Item */}
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm border-0 mb-6">
          <CardHeader>
            <CardTitle className="text-teal-700 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add Budget Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  placeholder="e.g., Venue, Food, Decorations"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newItem.amount}
                  onChange={(e) => setNewItem({...newItem, amount: e.target.value})}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Optional details"
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleAddItem}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Add Item
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Items List */}
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="text-gray-700">Budget Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {budgetItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No budget items yet</p>
                <p className="text-sm">Add your first budget item above to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {budgetItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.category}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-gray-800">
                        ${item.amount.toLocaleString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
