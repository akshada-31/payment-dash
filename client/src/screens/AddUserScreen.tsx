// src/screens/AddUserScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import api from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

export default function AddUserScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'admin' | 'viewer'>('viewer');

    const handleSubmit = async () => {
        try {
            await api.post('/users', { username, password, role });
            Alert.alert('Success', 'User created');
            navigation.navigate('Users');
        } catch (e: any) {
            Alert.alert('Error', e.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
            <View style={styles.roleContainer}>
                <Button title="Admin" onPress={() => setRole('admin')} color={role === 'admin' ? 'blue' : 'gray'} />
                <Button title="Viewer" onPress={() => setRole('viewer')} color={role === 'viewer' ? 'blue' : 'gray'} />
            </View>
            <Button title="Create User" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    input: { borderWidth: 1, marginVertical: 8, padding: 10, borderRadius: 5 },
    roleContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }
});
