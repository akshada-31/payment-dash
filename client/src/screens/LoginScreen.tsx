import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../services/api';
import { saveToken, getToken } from '../utils/auth';

type RootStackParamList = {
    Login: undefined;
    Dashboard: undefined;
};

type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type LoginResponse = {
    access_token: string;
    user: {
        id: number;
        username: string;
        role: string;
    };
};

export default function LoginScreen() {
    const navigation = useNavigation<LoginScreenProp>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            console.log('🔁 Attempting login with:', username, password);

            const res = await api.post<LoginResponse>('/auth/login', { username, password });
            const { access_token, user } = res.data;

            console.log('✅ Login successful:', res.data);

            await saveToken(access_token);
            navigation.replace('Dashboard'); // ⬅️ Check if this is executing
        } catch (err: any) {
            console.log('❌ Login error:', err?.response?.data || err);
            Alert.alert('Login failed', err?.response?.data?.message || 'Error');
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput value={username} onChangeText={setUsername} placeholder="Username" style={styles.input} />
            <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={styles.input} />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 5 },
});
