import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Note } from '../services/NoteService';

type Props = {
  note: Note;
  onPress: () => void;
  onDelete: () => void;
  onEdit?: () => void;
};

export default function NoteCard({ note, onPress, onDelete, onEdit }: Props) {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
        <Text style={styles.title}>{note.title || 'Untitled'}</Text>
        <Text numberOfLines={2}>{note.content}</Text>
      </TouchableOpacity>
      <View style={styles.icons}>
        {onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
            <MaterialIcons name="edit" size={24} color="#4CAF50" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
          <MaterialIcons name="delete" size={24} color="#FF4B5C" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 2,
  },
  title: { fontWeight: 'bold', marginBottom: 6 },
  icons: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  iconButton: { marginLeft: 12 },
});
