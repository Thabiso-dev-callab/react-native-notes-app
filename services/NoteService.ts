import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export type Note = {
  id: string;
  title?: string;
  content: string;
  category: string;
  dateAdded: string;
  lastEdited?: string;
};

export const getAllNotes = async (): Promise<Note[]> => {
  const v = await AsyncStorage.getItem('notes');
  return v ? JSON.parse(v) : [];
};

export const saveNotes = async (notes: Note[]) => {
  await AsyncStorage.setItem('notes', JSON.stringify(notes));
};

export const addNote = async (note: Omit<Note,'id'|'dateAdded'>) => {
  const notes = await getAllNotes();
  const newNote: Note = { id: uuidv4(), ...note, dateAdded: new Date().toISOString() };
  notes.push(newNote);
  await saveNotes(notes);
  return newNote;
};

export const updateNote = async (id: string, partial: Partial<Note>) => {
  const notes = await getAllNotes();
  const idx = notes.findIndex(n=>n.id===id);
  if (idx===-1) return null;
  notes[idx] = { ...notes[idx], ...partial, lastEdited: new Date().toISOString() };
  await saveNotes(notes);
  return notes[idx];
};

export const deleteNote = async (id: string) => {
  const notes = await getAllNotes();
  const filtered = notes.filter(n=>n.id!==id);
  await saveNotes(filtered);
};
