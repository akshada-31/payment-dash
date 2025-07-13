// src/screens/TransactionDetailsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import api from '../services/api';
import { RootStackParamList } from '../navigation/AppNavigator';

type TransactionDetailsRouteProp = RouteProp<RootStackParamList, 'TransactionDetails'>;

type Payment = {
    id: number;
    amount: number;
    receiver: string;
    method: string;
    status: string;
    createdAt: string;
};

export default function TransactionDetailsScreen() {
    const route = useRoute<TransactionDetailsRouteProp>();
    const { id } = route.params;

    const [payment, setPayment] = useState<Payment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const res = await api.get(`/payments/${id}`);
                setPayment(res.data);
            } catch (err) {
                console.error('Failed to fetch payment', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPayment();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!payment) {
        return (
            <View style={styles.center}>
                <Text>Payment not found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Payment #{payment.id}</Text>
            <Text>Receiver: {payment.receiver}</Text>
            <Text>Amount: ₹{payment.amount}</Text>
            <Text>Method: {payment.method}</Text>
            <Text>Status: {payment.status}</Text>
            <Text>Date: {new Date(payment.createdAt).toLocaleString()}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});
