import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Button,
    Platform,
    TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import api from '../services/api';

type Payment = {
    id: number;
    amount: number;
    receiver: string;
    method: string;
    status: string;
    createdAt: string;
};

type Nav = NativeStackNavigationProp<RootStackParamList, 'Transactions'>;

export default function TransactionListScreen() {
    const navigation = useNavigation<Nav>();

    const [transactions, setTransactions] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [method, setMethod] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchTransactions();
    }, [status, method, fromDate, toDate, page]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await api.get('/payments', {
                params: {
                    status: status || undefined,
                    method: method || undefined,
                    from: fromDate || undefined,
                    to: toDate || undefined,
                    page,
                },
            });
            setTransactions(res.data);
        } catch (err) {
            console.error('❌ Failed to fetch transactions', err);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: Payment }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('TransactionDetails', { id: item.id })}
        >
            <Text>Amount: ₹{item.amount}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Method: {item.method}</Text>
            <Text>Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📄 Transactions</Text>

            <View style={styles.filters}>
                <Text>Status:</Text>
                <Picker selectedValue={status} onValueChange={setStatus} style={styles.picker}>
                    <Picker.Item label="All" value="" />
                    <Picker.Item label="Success" value="success" />
                    <Picker.Item label="Failed" value="failed" />
                    <Picker.Item label="Pending" value="pending" />
                </Picker>

                <Text>Method:</Text>
                <Picker selectedValue={method} onValueChange={setMethod} style={styles.picker}>
                    <Picker.Item label="All" value="" />
                    <Picker.Item label="UPI" value="upi" />
                    <Picker.Item label="Card" value="card" />
                    <Picker.Item label="NetBanking" value="netbanking" />
                    <Picker.Item label="credit_card" value="credit_card" />
                </Picker>

                {Platform.OS === 'web' && (
                    <View style={styles.dateRow}>
                        <View style={styles.dateInput}>
                            <Text>From:</Text>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </View>
                        <View style={styles.dateInput}>
                            <Text>To:</Text>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </View>
                    </View>
                )}
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : transactions.length === 0 ? (
                <Text style={styles.center}>No transactions found.</Text>
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                />
            )}

            <View style={styles.pagination}>
                <Button title="Previous" disabled={page === 1} onPress={() => setPage(p => p - 1)} />
                <Text>Page {page}</Text>
                <Button title="Next" onPress={() => setPage(p => p + 1)} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    filters: { marginBottom: 10 },
    picker: { marginVertical: 5 },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
        marginVertical: 10,
    },
    dateInput: {
        display: 'flex',
        flexDirection: 'column',
    },
    center: { textAlign: 'center', marginTop: 20 },
    item: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        alignItems: 'center',
    },
});
