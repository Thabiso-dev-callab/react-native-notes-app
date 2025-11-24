import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { ProtectedStackParamList } from '../navigation/AppStack';
import { getAllNotes, deleteNote, Note } from '../services/NoteService';
import { User, logoutUser } from '../services/AuthService';
import NoteCard from '../components/NoteCard';

type NotesNavProp = NativeStackNavigationProp<ProtectedStackParamList, 'Notes'>;

type NotesScreenProps = {
  loggedInUser: User;
  onLogout: () => void;
  route: any;
};

export default function NotesScreen({
  loggedInUser,
  onLogout,
  route,
}: NotesScreenProps) {
  const navigation = useNavigation<NotesNavProp>();
  const isFocused = useIsFocused();
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState('');
  const category = route?.params?.category || 'All';
  const [loading, setLoading] = useState(false);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const all = await getAllNotes();
      setNotes(category === 'All' ? all : all.filter(n => n.category === category));
    } catch (err) {
      console.error('NotesScreen: failed to load notes', err);
      Alert.alert('Error', 'Failed to load notes. See console.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) loadNotes();
  }, [isFocused, route?.params?.refresh, route]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      onLogout();
    } catch (err) {
      console.error('NotesScreen: logout failed', err);
      Alert.alert('Error', 'Logout failed. See console.');
    }
  };

  const handleDeleteInline = async (id: string) => {
    try {
      await deleteNote(id);
      await loadNotes();
    } catch (err) {
      console.error('NotesScreen: delete failed', err);
      Alert.alert('Error', 'Failed to delete note. See console.');
    }
  };

  const filtered = notes.filter(
    n =>
      n.content.toLowerCase().includes(query.toLowerCase()) ||
      (n.title || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={handleLogout} style={styles.toolbarButton}>
          <MaterialIcons name="logout" size={28} color="#FF4B5C" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Profile', { userId: loggedInUser.id })
          }
          style={styles.toolbarButton}
        >
          <MaterialIcons name="person" size={28} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <Text style={styles.welcome}>Welcome, {loggedInUser.username}!</Text>

      <TextInput
        placeholder="Search notes..."
        style={styles.search}
        value={query}
        onChangeText={setQuery}
      />

      {filtered.length === 0 && !loading ? (
        <View style={styles.empty}>
          <Text>
            No notes found{category !== 'All' ? ` in "${category}"` : ''}.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={() =>
                navigation.navigate('NoteDetail', { noteId: item.id })
              }
              onEdit={() =>
                navigation.navigate('AddEditNote', {
                  noteId: item.id,
                  category: item.category,
                })
              }
              onDelete={() =>
                Alert.alert(
                  'Delete',
                  'Are you sure you want to delete this note?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => await handleDeleteInline(item.id),
                    },
                  ],
                  { cancelable: true }
                )
              }
            />
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditNote', { category })}
      >
        <MaterialIcons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  welcome: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  toolbarButton: { padding: 4 },
  search: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginBottom: 12 },
  empty: { alignItems: 'center', marginTop: 32 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#43a446ff',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
