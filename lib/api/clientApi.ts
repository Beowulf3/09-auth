import type { CreateNoteRequest, Note } from "../../types/note";
import nextServer from "./api";
import { User } from "@/types/user";

export interface FetchNoteResponse {
    notes: Note[],
    totalPages: number,
}

export interface FetchNoteParams {
    search?: string,
    page?: number,
    perPage?: number,
    tag?: string,
}

export const fetchNotes = async ({page, perPage, search, tag}: FetchNoteParams): Promise<FetchNoteResponse> => {
    const response = await nextServer.get<FetchNoteResponse>(`/notes`, {
        params: {
            page,
            perPage,
            search,
            tag,
            sortBy: 'created',
        }
    })   
    return response.data;
}

export const createNote = async (noteData: CreateNoteRequest ): Promise<Note> => {
    const res = await nextServer.post<Note>(`/notes`, noteData);
    return res.data;
}

export const deleteNote = async (id: string): Promise<Note> => {
    const res = await nextServer.delete<Note>(`/notes/${id}`);
    return res.data;
}

export const fetchNoteById = async (id:string): Promise<Note> => {
    const response = await nextServer.get<Note>(`/notes/${id}`);
    return response.data;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface UserRegister {
  username: string;
  email: string;
}

export async function register(data: RegisterRequest) {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
}

export async function login(data: RegisterRequest) {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
}

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

interface CheckSessionRequest {
  success: boolean;
}

export async function checkSession() {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
}

export const getMe = async () => {
  const res = await nextServer.get<User>("/users/me");
  return res.data;
};

export interface UpdateUserRequest {
  username: string;
}

export const getMeUpdate = async (payload: UpdateUserRequest) => {
  const res = await nextServer.patch<User>("/users/me", payload);
  return res.data;
};