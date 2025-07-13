// src/utils/auth.ts
// src/utils/auth.ts

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

let memoryToken: string | null = null;

export const saveToken = async (token: string) => {
    if (Platform.OS === 'web') {
        memoryToken = token; // in-memory for web
    } else {
        await SecureStore.setItemAsync('token', token);
    }
};

export const getToken = async () => {
    if (Platform.OS === 'web') {
        return memoryToken;
    } else {
        return await SecureStore.getItemAsync('token');
    }
};
export const removeToken = async () => {
    if (Platform.OS === 'web') {
        memoryToken = null;
    } else {
        await SecureStore.deleteItemAsync('token');
    }
};

