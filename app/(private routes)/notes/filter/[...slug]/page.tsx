import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

import NotesClient from "./Notes.client";
import fetchNotesServer from "@/lib/api/serverApi";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === "All" ? undefined : slug[0];
  return {
    title: tag ? `${tag} Notes` : "All Notes",
    description: tag ? `Notes filtered by: ${tag}` : "All Notes",
    openGraph: {
      title: tag ? `${tag} Notes` : "All Notes",
      description: tag ? `Notes filtered by: ${tag}` : "All Notes",
      url: `https://09-auth-zeta-lovat.vercel.app/notes/filter/${slug[0]}`,
      siteName: "Notehub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: tag ? `${tag} Notes` : "All Notes",
        },
      ],
    },
  };
}

const Notes = async ({ params }: Props) => {
  const { slug } = await params;
  const initialPage = 1;
  const initialSearch = "";
  const tag = slug[0] === "All" ? undefined : slug[0];

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", initialPage, initialSearch, tag],
    queryFn: () =>
      fetchNotesServer({
        page: initialPage,
        perPage: 15,
        search: initialSearch,
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
};

export default Notes;
