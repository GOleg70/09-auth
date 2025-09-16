// types/api.ts

export type CheckSessionRequest = {
  success: boolean;
};

export type UpdateUserRequest = {
  username: string;
  email?: string;
  avatar: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password?: string;
  avatar?: string;
  username: string;
};
