// services/AuthService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
};

/**
 * Generic set/get helpers with JSON (typed)
 */
export const saveData = async <T = unknown>(key: string, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('saveData error', key, err);
    throw err;
  }
};

export const getData = async <T = any>(key: string): Promise<T | null> => {
  try {
    const v = await AsyncStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch (err) {
    console.error('getData error', key, err);
    return null;
  }
};

/**
 * Registers a new user and makes them the logged-in user.
 * Returns the created user, or null if email already exists.
 */
export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const users: User[] = (await getData<User[]>('users')) || [];

    // simple duplicate check on email
    if (users.find(u => u.email === email)) return null;

    const newUser: User = { id: Date.now().toString(), username, email, password };
    users.push(newUser);

    await saveData('users', users);
    await saveData('loggedInUser', newUser);

    return newUser;
  } catch (err) {
    console.error('registerUser error', err);
    throw err;
  }
};

/**
 * Logs in a user by email/password, saves to loggedInUser on success.
 */
export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const users: User[] = (await getData<User[]>('users')) || [];
    const user = users.find(u => u.email === email && u.password === password) || null;
    if (user) await saveData('loggedInUser', user);
    return user;
  } catch (err) {
    console.error('loginUser error', err);
    return null;
  }
};

/**
 * Logs out the current user (removes loggedInUser key)
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('loggedInUser');
  } catch (err) {
    console.error('logoutUser error', err);
    throw err;
  }
};
