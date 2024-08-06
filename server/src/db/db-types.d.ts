export interface user {
  id: number;
  is_verified: boolean;
  otp: string | null;
  name: string;
  email: string;
  password: string;
  avatar: number;
  about: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCompleteType {
  id: number;
  is_verified: boolean;
  otp: string | null;
  name: string;
  email: string;
  password: string;
  avatar: number;
  about: string | null;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  friends?: number[];
}
