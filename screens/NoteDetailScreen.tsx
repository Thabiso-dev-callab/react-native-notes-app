import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { getAllNotes, deleteNote, Note } from '../services/NoteService';

type NoteDetailRouteParams = {
  noteId?: string;
 
  onDelete?: () => Promise<void> | void;
  onSave?: () => Promise<void> | void;
};

export default function NoteDetailScreen({ route, navigation }: any) {
  const { noteId, onDelete, onSave } = (route.params || {}) as NoteDetailRouteParams;
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!noteId) return;
      const all = await getAllNotes();
      const n = all.find(x => x.id === noteId) || null;
      if (mounted) setNote(n);
    })();
    return () => { mounted = false; };
  }, [noteId]);

  const handleDeleteConfirmed = async () => {
    try {
      if (!noteId) return;
      await deleteNote(noteId);
      
      if (onDelete) await onDelete();
     
      navigation.goBack();
    } catch (err) {
      console.error('delete error', err);
      Alert.alert('Error', 'Failed to delete note');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDeleteConfirmed },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = () => {
    if (!note) return;
    navigation.navigate('AddEditNote', {
      noteId: note.id,
      category: note.category,
      
      onSave,
    });
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.title || 'Untitled'}</Text>
      <Text style={styles.content}>{note.content}</Text>

      <View style={{ height: 12 }} />
      <Button title="Edit" onPress={handleEdit} />
      <View style={{ height: 8 }} />
      <Button title="Delete" onPress={handleDelete} color="#ff4b5c" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  content: { fontSize: 16 },
});
