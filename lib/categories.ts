export const INCOME_CATEGORIES = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Outros',
] as const;

export const EXPENSE_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Outros',
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  'Salário': '#3B82F6',
  'Freelance': '#8B5CF6',
  'Investimentos': '#10B981',
  'Outros': '#6B7280',
  'Alimentação': '#F59E0B',
  'Transporte': '#3B82F6',
  'Moradia': '#EF4444',
  'Lazer': '#EC4899',
  'Saúde': '#10B981',
  'Educação': '#8B5CF6',
};

export type IncomeCategory = typeof INCOME_CATEGORIES[number];
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
