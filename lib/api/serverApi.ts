
import nextServer from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import { FetchNoteParams, FetchNoteResponse } from "./clientApi";
import { cookies } from "next/headers";

export default async function fetchNotesServer({page, perPage, search, tag}: FetchNoteParams): Promise<FetchNoteResponse> {
  const cookieStore = await cookies();

  const response = await nextServer.get<FetchNoteResponse>("/notes", {
    params: {
      search,
      page,
      tag,
      perPage,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
}

export async function fetchNoteByIdServer(id: string): Promise<Note> {
  const cookieStore = await cookies();

  const responseById = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return responseById.data;
}

export const getMeServer = async () => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res;
};