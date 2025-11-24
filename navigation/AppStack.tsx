// navigation/AppStack.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import NotesScreen from '../screens/NotesScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';
import AddEditNoteScreen from '../screens/AddEditNoteScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { getData } from '../services/AuthService';
import type { User } from '../services/AuthService';
import { JSX } from 'react/jsx-runtime';

/**
 * Navigation param lists
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type ProtectedStackParamList = {
  Notes: { category?: string } | undefined;
  NoteDetail: {
    noteId: string;
    onDelete?: () => Promise<void> | void;
    onSave?: () => Promise<void> | void;
  };
  AddEditNote: {
    noteId?: string;
    category?: string;
    onSave?: () => Promise<void> | void;
  };
  Profile: { userId: string };
};

/**
 * Stacks
 */
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const ProtectedStack = createNativeStackNavigator<ProtectedStackParamList>();

/**
 * Auth stack screens (Login/Register)
 * - LoginScreen expects an onLogin prop, so we wrap it to inject onLogin
 */
function AuthStackScreens({ onLogin }: { onLogin: (user: User) => void }): JSX.Element {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login">
        {props => <LoginScreen {...props} onLogin={onLogin} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

/**
 * Protected stack screens (Notes, NoteDetail, AddEditNote, Profile)
 * NotesScreen and ProfileScreen expect extra props (loggedInUser, onLogout)
 * so we wrap them here to inject those props while preserving navigation props.
 */
function ProtectedStackScreens({
  loggedInUser,
  onLogout,
}: {
  loggedInUser: User;
  onLogout: () => void;
}): JSX.Element {
  return (
    <ProtectedStack.Navigator screenOptions={{ headerShown: true }}>
      <ProtectedStack.Screen name="Notes">
        {props => (
          <NotesScreen
            {...props}
            loggedInUser={loggedInUser}
            onLogout={onLogout}
          />
        )}
      </ProtectedStack.Screen>

      <ProtectedStack.Screen
        name="NoteDetail"
        // NoteDetail receives navigation/route automatically; callers may pass onDelete/onSave via params
        component={NoteDetailScreen}
        options={{ title: 'Note Detail' }}
      />

      <ProtectedStack.Screen
        name="AddEditNote"
        component={AddEditNoteScreen}
        options={{ title: 'Add / Edit' }}
      />

      <ProtectedStack.Screen name="Profile">
        {props => (
          <ProfileScreen
            {...props}
            loggedInUser={loggedInUser}
            onLogout={onLogout}
          />
        )}
      </ProtectedStack.Screen>
    </ProtectedStack.Navigator>
  );
}

/**
 * Root AppStack component
 * - loads persisted loggedInUser and conditionally renders Auth vs Protected stacks
 */
export default function AppStack(): JSX.Element | null {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await getData('loggedInUser');
        setLoggedInUser(u);
      } catch (err) {
        console.error('AppStack: failed to load loggedInUser', err);
        setLoggedInUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      {loggedInUser ? (
        <ProtectedStackScreens
          loggedInUser={loggedInUser}
          onLogout={() => setLoggedInUser(null)}
        />
      ) : (
        <AuthStackScreens onLogin={(user: User) => setLoggedInUser(user)} />
      )}
    </NavigationContainer>
  );
}
