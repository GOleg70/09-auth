import { cookies } from 'next/headers';
import { Note, CreateNote } from '../../types/note';
import { User } from '../../types/user';
import { nextServer } from './api';

// interface NotesHttpResponse {
//   notes: Note[];
//   totalPages: number;
// }

export const getServerNotes = async (
  query = '',
  page = 1,
  perPage = 12,
  tag?: string
) => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('sessionId');

  if (!sessionCookie) {
    return {
      status: 401,
      data: { notes: [], totalPages: 0 },
    };
  }

  const PARAMS = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
    ...(query.trim() ? { search: query } : {}),
    ...(tag ? { tag } : {}),
  });

  try {
    const response = await nextServer.get('/notes', {
      params: PARAMS,
      headers: {
        Cookie: `${sessionCookie.name}=${sessionCookie.value}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch notes on server:', error);
    return {
      status: 500,
      data: { notes: [], totalPages: 0 },
    };
  }
};

export const createServerNote = async (newNote: CreateNote): Promise<Note> => {
  const cookieStore = await cookies();
  const response = await nextServer.post('/notes', newNote, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const fetchServerNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const response = await nextServer.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const deleteServerNote = async (id: string) => {
  const cookieStore = await cookies();
  const response = await nextServer.delete<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const editProfile = async (data: User) => {
  const cookieStore = await cookies();
  const res = await nextServer.patch('/users/me', data, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
};

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const checkSession = async () => {
  const cookieStore = await cookies();
  const response = await nextServer.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response;
};
