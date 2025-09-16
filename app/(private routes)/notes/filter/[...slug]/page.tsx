import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import getQueryClient from '@/lib/api/getQueryClient';
import { getServerNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';
import { NOTE_TAGS } from '@/lib/constants';
import type { NoteTag } from '@/types/note';
import type { Metadata } from 'next';

type PageProps = {
  params: { slug?: string[] };
  searchParams: { page?: string; search?: string; tag?: string };
};

function mapSlugToTag(slug: string[] | undefined): NoteTag | undefined {
  const raw = slug?.[0];
  if (!raw || raw === 'All') return undefined;

  const allowed = NOTE_TAGS as readonly string[];
  return allowed.includes(raw) ? (raw as NoteTag) : undefined;
}

function mapQueryParamToTag(queryTag: string | undefined): NoteTag | undefined {
  if (!queryTag) return undefined;

  const allowed = NOTE_TAGS as readonly string[];
  return allowed.includes(queryTag) ? (queryTag as NoteTag) : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageProps['params']>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const raw = resolvedParams.slug?.[0] ?? 'All';

  const title =
    raw === 'All' ? 'All Notes — NoteHub' : `${raw} Notes — NoteHub`;
  const description =
    raw === 'All'
      ? 'Browse all notes in NoteHub.'
      : `Browse notes from the "${raw}" category in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-xi-one.vercel.app/notes/filter/${raw}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          alt: 'NoteHub Open Graph Image',
        },
      ],
    },
  };
}

export default async function NotesPage({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const query = resolvedSearchParams.search ?? '';
  const page = resolvedSearchParams.page
    ? Number(resolvedSearchParams.page)
    : 1;
  const initialTag =
    mapSlugToTag(resolvedParams.slug) ??
    mapQueryParamToTag(resolvedSearchParams.tag);

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', { page, search: query, tag: initialTag }],
    queryFn: () => getServerNotes(query, page, 12, initialTag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={initialTag} />
    </HydrationBoundary>
  );
}
