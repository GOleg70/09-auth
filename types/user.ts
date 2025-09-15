export type User = {
  id: string;
  email: string;
  username: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
};

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
