'use client';

import {
  CheckSessionRequest,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  User,
} from '@/types/user';
import { api } from './api';
import { CreateNote, Note, NoteTag } from '@/types/note';

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const { data } = await api.get<FetchNotesResponse>('/notes', { params });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(noteData: CreateNote): Promise<Note> {
  const { data } = await api.post<Note>('/notes', noteData);
  return data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${noteId}`);
  return data;
}

export const register = async (data: RegisterRequest) => {
  const res = await api.post<User>('/auth/register', data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await api.post<User>('/auth/login', data);
  return res.data;
};

export const editProfile = async (data: UpdateUserRequest) => {
  const res = await api.patch<User>('/users/me', data);
  return res.data;
};

export const checkSession = async () => {
  const res = await api.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};
