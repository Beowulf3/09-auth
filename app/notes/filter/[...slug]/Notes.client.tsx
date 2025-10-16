"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

import css from "./notes.module.css";
import { fetchNotes } from "../../../../lib/api";
import NoteList from "../../../../components/NoteList/NoteList";
import Pagination from "../../../../components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";

type NotesClientProps = {
  tag?: string;
};

function NotesClient({ tag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [delayedSearch] = useDebounce(search, 500);

  const { data, isSuccess, isError, error } = useQuery({
    queryKey: ["notes", currentPage, delayedSearch, tag],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: 15,
        search: delayedSearch,
        tag,
      }),
    placeholderData: keepPreviousData,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userSearch = e.target.value.trim();
    setSearch(userSearch);
    setCurrentPage(1);
  };

  const notesArray = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    if (data && notesArray.length === 0) {
      toast.error("No notes for your request :(");
    }
  }, [data, notesArray.length]);

  if (isError)
    return (
      <div className={css.error}>
        Could not fetch the list of notes.
        {error?.message || "Something went wrong"}
      </div>
    );

  return (
    <div className={css.app}>
      {isSuccess && (
        <div className={css.toolbar}>
          <SearchBox onChange={handleChange} />
          {isSuccess && totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
          <Link className={css.button} href={"/notes/action/create"}>
            Create note +
          </Link>
        </div>
      )}
      {data && notesArray.length !== 0 && <NoteList notes={notesArray} />}
      <Toaster />
    </div>
  );
}

export default NotesClient;
