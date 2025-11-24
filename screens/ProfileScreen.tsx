import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getData, saveData, logoutUser, User } from '../services/AuthService';

type ProfileScreenProps = {
  loggedInUser: User;
  onLogout: () => void;
};

export default function ProfileScreen({ loggedInUser, onLogout }: ProfileScreenProps) {
  const [username, setUsername] = useState(loggedInUser.username);
  const [email, setEmail] = useState(loggedInUser.email);

  const handleSave = async () => {
    const updated = { ...loggedInUser, username, email };
    const users = (await getData('users')) || [];
    const newUsers = users.map((x: any) => (x.id === loggedInUser.id ? updated : x));
    await saveData('users', newUsers);
    await saveData('loggedInUser', updated);
    Alert.alert('Saved');
  };

  const handleLogout = async () => {
    await logoutUser();
    onLogout(); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Username" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="Email" />
      <Button title="Save" onPress={handleSave} />
      <View style={{ height: 12 }} />
      <Button title="Logout" onPress={handleLogout} color="#ff4b5c" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12, borderRadius: 8 },
});
