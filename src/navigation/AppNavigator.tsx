import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AttendanceScreen from '../screens/AttendanceScreen';
import LogsScreen from '../screens/LogsScreen';
import SalaryScreen from '../screens/SalaryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SalaryConfigScreen from '../screens/SalaryConfigScreen';
import ThemeSettingsScreen from '../screens/ThemeSettingsScreen';
import PolicyScreen from '../screens/PolicyScreen';
import SupportFeedbackScreen from '../screens/SupportFeedbackScreen';
import FlashGuideScreen from '../screens/FlashGuideScreen';
import { useAppTheme } from '../hooks/useAppTheme';
import { useThemeStore } from '../store/useThemeStore';

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

const GUIDE_SEEN_KEY = 'flash-guide-seen-v1';

const ProfileStackScreen = () => {
  const theme = useAppTheme();

  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.surface },
      }}
    >
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="SalaryConfig" component={SalaryConfigScreen} />
      <ProfileStack.Screen
        name="ThemeSettings"
        component={ThemeSettingsScreen}
        options={{ headerShown: true, title: 'Giao diện' }}
      />
      <ProfileStack.Screen
        name="Policy"
        component={PolicyScreen}
        options={{ headerShown: true, title: 'Chính sách & Quy định' }}
      />
      <ProfileStack.Screen
        name="SupportFeedback"
        component={SupportFeedbackScreen}
        options={{ headerShown: true, title: 'Hỗ trợ & Góp ý' }}
      />
    </ProfileStack.Navigator>
  );
};

const MainTabs = () => {
  const theme = useAppTheme();

  return (
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
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: 'absolute',
          elevation: 8,
          shadowColor: '#191C23',
          shadowOffset: {
            width: 0,
            height: -8,
          },
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
        },
      })}
    >
      <Tab.Screen name="Attendance" component={AttendanceScreen} options={{ title: 'Điểm danh' }} />
      <Tab.Screen name="Logs" component={LogsScreen} options={{ title: 'Lịch sử' }} />
      <Tab.Screen name="Salary" component={SalaryScreen} options={{ title: 'Bảng lương' }} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} options={{ title: 'Cá nhân' }} />
    </Tab.Navigator>
  );
};

export default function AppNavigator() {
  const theme = useAppTheme();
  const mode = useThemeStore((s) => s.mode);
  const systemScheme = useColorScheme();
  const [guideSeen, setGuideSeen] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(GUIDE_SEEN_KEY).then((v) => {
      setGuideSeen(v === '1');
    });
  }, []);

  const markGuideSeen = async () => {
    await AsyncStorage.setItem(GUIDE_SEEN_KEY, '1');
    setGuideSeen(true);
  };

  const resolvedDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
  const navTheme = resolvedDark ? DarkTheme : DefaultTheme;

  if (guideSeen === null) return null;

  return (
    <NavigationContainer
      theme={{
        ...navTheme,
        colors: {
          ...navTheme.colors,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.onSurface,
          primary: theme.colors.primary,
          border: theme.colors.outlineVariant,
        },
      }}
    >
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!guideSeen && (
          <RootStack.Screen name="FlashGuide">
            {() => <FlashGuideScreen onDone={markGuideSeen} />}
          </RootStack.Screen>
        )}
        <RootStack.Screen name="MainTabs" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
