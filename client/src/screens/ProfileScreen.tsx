// src/screens/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { removeToken } from '../utils/auth';
import api from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export default function ProfileScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/auth/me');
                setUser(res.data);
            } catch (err) {
                console.error('❌ Failed to fetch user:', err);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        await removeToken();
        navigation.replace('Login');
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>👤 Profile</Text>
            <Text style={styles.label}>Username: {user.username}</Text>
            <Text style={styles.label}>Role: {user.role}</Text>
            <Button title="Logout" onPress={handleLogout} color="#e74c3c" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    label: { fontSize: 18, marginBottom: 10 },
});
