'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, TrendingDown } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/format';
import { EXPENSE_CATEGORIES } from '@/lib/categories';
import { TransactionModal } from './transaction-modal';
import { FadeIn } from '@/components/ui/animate';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string | null;
}

export function ExpensesClient() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [monthFilter, setMonthFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (monthFilter && monthFilter !== 'all') params.set('month', monthFilter);
      if (categoryFilter && categoryFilter !== 'all') params.set('category', categoryFilter);
      const res = await fetch(`/api/expenses?${params.toString()}`);
      const data = await res.json();
      setExpenses(data?.expenses ?? []);
      setTotal(data?.total ?? 0);
    } catch {
      toast.error('Erro ao carregar gastos');
    } finally {
      setLoading(false);
    }
  }, [monthFilter, categoryFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (formData: any) => {
    if (editItem) {
      const res = await fetch(`/api/expenses/${editItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.error) { toast.error(data.error); throw new Error(data.error); }
      toast.success('Gasto atualizado!');
    } else {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.error) { toast.error(data.error); throw new Error(data.error); }
      toast.success('Gasto adicionado!');
    }
    setEditItem(null);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/expenses/${deleteId}`, { method: 'DELETE' });
      toast.success('Gasto excluído');
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error('Erro ao excluir');
    }
  };

  const getMonthOptions = () => {
    const now = new Date();
    const options = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      options.push({ value: val, label: label.charAt(0).toUpperCase() + label.slice(1) });
    }
    return options;
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Gastos</h1>
            <p className="text-muted-foreground text-sm mt-1">Controle seus gastos por categoria.</p>
          </div>
          <Button onClick={() => { setEditItem(null); setModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Adicionar Gasto
          </Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={monthFilter} onValueChange={(v: string) => setMonthFilter(v)}>
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Filtrar por mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os meses</SelectItem>
              {getMonthOptions().map((o: any) => (
                <SelectItem key={o?.value} value={o?.value ?? ''}>{o?.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(v: string) => setCategoryFilter(v)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {EXPENSE_CATEGORIES.map((c: string) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Card className="ml-auto hidden sm:flex items-center px-4 py-2">
            <TrendingDown className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-sm font-medium">Total: </span>
            <span className="ml-1 font-mono font-bold text-red-500">{formatCurrency(total)}</span>
          </Card>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i: number) => <Skeleton key={i} className="h-12 rounded" />)}
              </div>
            ) : (expenses?.length ?? 0) === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <TrendingDown className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum gasto encontrado</p>
                <Button variant="outline" className="mt-4" onClick={() => { setEditItem(null); setModalOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" /> Adicionar primeiro gasto
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Data</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Categoria</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">Descrição</th>
                      <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Valor</th>
                      <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(expenses ?? []).map((item: Expense) => (
                      <tr key={item?.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 text-sm">{formatDate(item?.date)}</td>
                        <td className="px-4 py-3">
                          <span className="text-sm px-2 py-1 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 font-medium">{item?.category}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{item?.description || '—'}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-sm text-red-500">{formatCurrency(item?.amount)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditItem(item); setModalOpen(true); }}>
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(item?.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      <div className="sm:hidden">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <span className="text-sm font-medium">Total de Gastos</span>
            <span className="font-mono font-bold text-red-500">{formatCurrency(total)}</span>
          </CardContent>
        </Card>
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(null); }}
        onSave={handleSave}
        title={editItem ? 'Editar Gasto' : 'Adicionar Gasto'}
        categories={EXPENSE_CATEGORIES}
        initialData={editItem}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o: boolean) => { if (!o) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir gasto?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
