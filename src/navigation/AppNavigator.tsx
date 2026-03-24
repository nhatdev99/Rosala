import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import AttendanceScreen from '../screens/AttendanceScreen';
import LogsScreen from '../screens/LogsScreen';
import SalaryScreen from '../screens/SalaryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { theme } from '../utils/theme';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any = 'timer';

            if (route.name === 'Attendance') iconName = focused ? 'timer' : 'timer-outline';
            else if (route.name === 'Logs') iconName = focused ? 'calendar' : 'calendar-outline';
            else if (route.name === 'Salary') iconName = focused ? 'cash' : 'cash-outline';
            else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.outline,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            position: 'absolute',
            elevation: 8,
            shadowColor: '#191C23',
            shadowOffset: { width: 0, height: -8 },
            shadowOpacity: 0.06,
            shadowRadius: 24,
            borderTopWidth: 0,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontFamily: theme.typography.body,
            fontSize: 11,
            fontWeight: '500',
            letterSpacing: 0.5,
          }
        })}
      >
        <Tab.Screen name="Attendance" component={AttendanceScreen} options={{ title: 'Điểm danh' }} />
        <Tab.Screen name="Logs" component={LogsScreen} options={{ title: 'Lịch sử' }} />
        <Tab.Screen name="Salary" component={SalaryScreen} options={{ title: 'Bảng lương' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Cá nhân' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
