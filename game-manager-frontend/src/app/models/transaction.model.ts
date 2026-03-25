export interface Transaction {
  id: number;
  user_id: number;
  type: 'purchase' | 'top_up';
  amount: string | number;
  game_id: number | null;
  created_at: string;
  updated_at: string;
  user?: { id: number; name: string; email: string };
  game?: { id: number; title: string } | null;
}

export interface PaginatedTransactions {
  data: Transaction[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}
