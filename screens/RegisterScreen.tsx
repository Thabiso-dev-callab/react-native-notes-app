import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AppStack';
import { registerUser } from '../services/AuthService';

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<AuthNavProp>();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !password) return Alert.alert('Error','Fill all fields');
    const user = await registerUser(username, email, password);
    if (!user) return Alert.alert('Error','Email exists');
    Alert.alert('Success','Registered');
    navigation.reset({ index:0, routes:[{ name:'Login' as any }] });
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',padding:20},
  input:{borderWidth:1,borderColor:'#ccc',padding:10,marginBottom:13,borderRadius:8}
});
