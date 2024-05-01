'use client';
import { CollectionGroup } from './interfaces';

export const safeContext = ({ dataContext }: { dataContext: CollectionGroup }) => {
  const safe = JSON.parse(JSON.stringify(dataContext)) as CollectionGroup;
  safe.collections.forEach((collection) => {
    if (collection.title.length === 0) {
      collection.title = 'Untitled Collection';
    }
    collection.notes.forEach((note) => {
      if (note.title.length === 0) {
        note.title = 'Untitled Note';
      }
      if (note.description.length === 0) {
        note.description = 'Add a description here';
      }
    });
  });
  return safe;
};

export const newData = ({ data }: { data: CollectionGroup }) => {
  const newData = JSON.parse(JSON.stringify(data)) as CollectionGroup;
  newData.collections.forEach((collection, index) => {
    collection.id = index + 1;
    collection.notes.forEach((note, noteIndex) => {
      note.id = noteIndex + 1;
    });
  });
  return newData;
};

export const createMouseLoader = () => {
  const style = document.createElement('style');
  return style;
};

export const startMouseLoader = ({ mouseLoader }: { mouseLoader: HTMLStyleElement }) => {
  mouseLoader.innerHTML = `* { cursor: wait}`;
  document.head.appendChild(mouseLoader);
};

export const stopMouseLoader = ({ mouseLoader }: { mouseLoader: HTMLStyleElement }) => {
  document.head.removeChild(mouseLoader);
};
