'use server';

interface Note {
  id: number;
  title: string;
  description: string;
}

interface Collection {
  id: number;
  title: string;
  notes: Note[];
}

type TButtonSubmit = 'login' | 'createAccount' | 'resetPassword';

interface CollectionGroup {
  collections: Collection[];
}

interface Message {
  message: string;
}

export type { CollectionGroup, Collection, Note, TButtonSubmit, Message };
