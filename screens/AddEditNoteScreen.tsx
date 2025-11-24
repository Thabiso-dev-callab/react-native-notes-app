
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { addNote, getAllNotes, updateNote } from '../services/NoteService';

export default function AddEditNoteScreen({ route, navigation }: any) {
  const { noteId, category } = route.params || {};
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cat, setCat] = useState(category || 'General');
  const [saving, setSaving] = useState(false);

  
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!noteId) return;
      try {
        const all = await getAllNotes();
        const existing = all.find(n => n.id === noteId);
        if (mounted && existing) {
          setTitle(existing.title || '');
          setContent(existing.content);
          setCat(existing.category);
        }
      } catch (err) {
        console.error('AddEditNote: load failed', err);
        Alert.alert('Error', 'Failed to load note. See console.');
      }
    })();
    return () => { mounted = false; };
  }, [noteId]);

  const handleSave = async () => {
    try {
      if (!content || !content.trim()) {
        Alert.alert('Error', 'Content is required.');
        return;
      }
      setSaving(true);

      if (noteId) {
        await updateNote(noteId, { title, content, category: cat });
      } else {
        await addNote({ title, content, category: cat });
      }

      
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Notes', { category: cat });
      }
    } catch (err) {
      console.error('AddEditNote: save failed', err);
      Alert.alert('Error', 'Failed to save note. See console.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title (optional)"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Content"
        style={[styles.input, { height: 140 }]}
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TextInput
        placeholder="Category"
        style={styles.input}
        value={cat}
        onChangeText={setCat}
      />
      <Button
        title={saving ? 'Saving...' : 'Save'}
        onPress={handleSave}
        disabled={saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 9, marginBottom: 12 },
});
