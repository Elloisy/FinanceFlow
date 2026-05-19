'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  title: string;
  categories: readonly string[];
  initialData?: {
    amount?: number;
    category?: string;
    date?: string;
    description?: string | null;
  } | null;
}

export function TransactionModal({ open, onClose, onSave, title, categories, initialData }: TransactionModalProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setAmount(String(initialData?.amount ?? ''));
        setCategory(initialData?.category ?? '');
        const d = initialData?.date ? new Date(initialData.date) : null;
        setDate(d ? d.toISOString().split('T')[0] ?? '' : '');
        setDescription(initialData?.description ?? '');
      } else {
        setAmount('');
        setCategory(categories?.[0] ?? '');
        setDate(new Date().toISOString().split('T')[0] ?? '');
        setDescription('');
      }
    }
  }, [open, initialData, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;
    setSaving(true);
    try {
      await onSave({ amount: parseFloat(amount), category, date, description: description || null });
      onClose();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Valor (R$) *</label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e: any) => setAmount(e?.target?.value ?? '')}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Categoria *</label>
            <Select value={category} onValueChange={(v: string) => setCategory(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {(categories ?? []).map((c: string) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Data *</label>
            <Input
              type="date"
              value={date}
              onChange={(e: any) => setDate(e?.target?.value ?? '')}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Descrição</label>
            <Input
              placeholder="Descrição (opcional)"
              value={description}
              onChange={(e: any) => setDescription(e?.target?.value ?? '')}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving || !amount || !category || !date}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
