export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  balance?: number;
  profile_picture?: string | null;
  bio?: string | null;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
  token_type: string;
}