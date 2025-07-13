// src/screens/AddPaymentScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Button,
    Alert,
} from 'react-native';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'; // ✅ updated import

export default function AddPaymentScreen() {
    const [amount, setAmount] = useState('');
    const [receiver, setReceiver] = useState('');
    const [method, setMethod] = useState('upi');
    const [status, setStatus] = useState('success');

    const navigation = useNavigation();

    const handleSubmit = async () => {
        if (!amount || !receiver) {
            Alert.alert('Validation', 'Amount and Receiver are required.');
            return;
        }

        try {
            await api.post('/payments', {
                amount: Number(amount),
                receiver,
                method,
                status,
            });

            Alert.alert('Success', 'Payment added successfully.');
            navigation.goBack();
        } catch (err: any) {
            console.error(err);
            Alert.alert('Error', err?.response?.data?.message || 'Something went wrong.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Payment</Text>

            <TextInput
                placeholder="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.input}
            />

            <TextInput
                placeholder="Receiver"
                value={receiver}
                onChangeText={setReceiver}
                style={styles.input}
            />

            <Text style={styles.label}>Method</Text>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={method}
                    onValueChange={(value) => setMethod(value)}
                >
                    <Picker.Item label="UPI" value="upi" />
                    <Picker.Item label="Card" value="card" />
                    <Picker.Item label="Netbanking" value="netbanking" />
                </Picker>
            </View>

            <Text style={styles.label}>Status</Text>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={status}
                    onValueChange={(value) => setStatus(value)}
                >
                    <Picker.Item label="Success" value="success" />
                    <Picker.Item label="Pending" value="pending" />
                    <Picker.Item label="Failed" value="failed" />
                </Picker>
            </View>

            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 6,
        marginBottom: 16,
    },
    label: { fontWeight: 'bold', marginTop: 10 },
    pickerWrapper: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: '#ccc',
        marginBottom: 16,
    },
});
