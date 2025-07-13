// src/navigation/AppNavigator.tsx
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TransactionListScreen from '../screens/TransactionListScreen';
import TransactionDetailsScreen from '../screens/TransactionDetailsScreen';
import AddPaymentScreen from '../screens/AddPaymentScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddUserScreen from '../screens/AddUserScreen';
import UsersScreen from '../screens/UsersScreen';

export type RootStackParamList = {
    Login: undefined;
    Dashboard: undefined;
    Transactions: undefined;
    TransactionDetails: { id: number };
    AddPayment: undefined;
    Profile: undefined;
    AddUser: undefined;
    Users: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Dashboard" component={DashboardScreen} />
                <Stack.Screen name="Transactions" component={TransactionListScreen} />
                <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />
                <Stack.Screen name="AddPayment" component={AddPaymentScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="AddUser" component={AddUserScreen} />
                <Stack.Screen name="Users" component={UsersScreen} options={{ title: 'User Management' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
