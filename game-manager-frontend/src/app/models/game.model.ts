export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Game {
  id: number;
  title: string;
  description: string;
  price: string | number;
  cover_image: string | null;
  category: Category;
  created_at?: string;
  updated_at?: string;
}

export interface GameRequest {
  title: string;
  description: string;
  price: number;
  cover_image?: string;
  category_id: number;
}

export interface GameFilters {
  search?: string;
  category_id?: number | null;
  sort_by?: 'created_at' | 'price' | 'title';
  sort_order?: 'asc' | 'desc';
  min_price?: number | string;
  max_price?: number | string;
}

export interface PaginatedGames {
  data: Game[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}