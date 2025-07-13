import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Button,
    TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';


const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
    type Nav = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
    const navigation = useNavigation<Nav>();

    const [stats, setStats] = useState<any>(null);
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchDashboard = async () => {
                try {
                    const [statsRes, meRes] = await Promise.all([
                        api.get('/payments/stats'),
                        api.get('/auth/me'),
                    ]);
                    setStats(statsRes.data);
                    setRole(meRes.data.role);
                } catch (err) {
                    console.error('❌ Dashboard fetch failed:', err);
                } finally {
                    setLoading(false);
                }
            };

            fetchDashboard();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>📊 Dashboard</Text>

            <View style={styles.card}>
                <Text>Total Revenue: ₹{stats?.totalRevenue ?? 0}</Text>
                <Text>Payments Today: {stats?.totalPaymentsToday ?? 0}</Text>
                <Text>Payments This Week: {stats?.totalPaymentsThisWeek ?? 0}</Text>
                <Text>Failed Transactions: {stats?.failedTransactions ?? 0}</Text>
            </View>

            {Array.isArray(stats.revenueLast7Days) && stats.revenueLast7Days.length > 0 ? (
                <>
                    <Text style={styles.chartTitle}>Revenue - Last 7 Days</Text>
                    <LineChart
                        data={{
                            labels: ['6d', '5d', '4d', '3d', '2d', '1d', 'Today'],
                            datasets: [{ data: stats.revenueLast7Days }],
                        }}
                        width={screenWidth - 20} // widened
                        height={260}
                        yAxisSuffix="₹"
                        chartConfig={{
                            backgroundColor: '#ffffff',
                            backgroundGradientFrom: '#f7f7f7',
                            backgroundGradientTo: '#e0e0e0',
                            color: (opacity = 1) => `rgba(34, 94, 168, ${opacity})`,
                            strokeWidth: 2,
                        }}
                        bezier
                        style={styles.chart}
                    />
                </>
            ) : (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>No chart data available</Text>
            )}

            <View style={styles.buttonGroup}>
                <Button title="📂 Go to Profile" onPress={() => navigation.navigate('Profile')} />
                <Button title="➕ Add Payment" onPress={() => navigation.navigate('AddPayment')} />
                <Button title="📃 Transactions" onPress={() => navigation.navigate('Transactions')} />

                {role === 'admin' && (
                    <>
                        <Button title="👤 View All Users" onPress={() => navigation.navigate('Users')} />
                        <Button title="➕ Add New User" onPress={() => navigation.navigate('AddUser')} />
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        marginBottom: 30,
        elevation: 3,
    },
    chartTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    chart: { borderRadius: 10 },
    buttonGroup: {
        gap: 12,
        marginTop: 20,
    },
});
