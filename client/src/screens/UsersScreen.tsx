// src/screens/UsersScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import api from '../services/api';

type User = { id: number; username: string; role: string };

export default function UsersScreen() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<User[]>('/users').then(res => setUsers(res.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return <ActivityIndicator size="large" style={styles.center} />;

    return (
        <FlatList
            data={users}
            keyExtractor={u => u.id.toString()}
            renderItem={({ item }) => <Text style={styles.item}>{item.username} — {item.role}</Text>}
        />
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    item: { padding: 15, borderBottomWidth: 1 }
});
