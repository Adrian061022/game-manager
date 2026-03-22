export interface Review {
  id: number;
  user_id: number;
  game_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    profile_picture: string | null;
  };
}

export interface ReviewRequest {
  rating: number;
  comment: string;
}

export interface ReviewsResponse {
  data: Review[];
  meta: {
    average_rating: number;
    total_reviews: number;
  };
}
