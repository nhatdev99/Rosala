import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

import AttendanceScreen from '../screens/AttendanceScreen';
import LogsScreen from '../screens/LogsScreen';
import SalaryScreen from '../screens/SalaryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SalaryConfigScreen from '../screens/SalaryConfigScreen';
import ThemeSettingsScreen from '../screens/ThemeSettingsScreen';
import PolicyScreen from '../screens/PolicyScreen';
import UserGuideScreen from '../screens/UserGuideScreen';
import SupportFeedbackScreen from '../screens/SupportFeedbackScreen';
import PersonalInfoScreen from '../screens/PersonalInfoScreen';
import FlashGuideScreen from '../screens/FlashGuideScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

import { useAppTheme } from '../hooks/useAppTheme';
import { useThemeStore } from '../store/useThemeStore';
import { useProfileStore } from '../store/useProfileStore';
import { auth } from '../services/firebase';
import { readAuthSession } from '../services/authSession';
import { fetchUserProfile } from '../services/userProfileService';
import { useAutoFirebaseSync } from '../hooks/useAutoFirebaseSync';

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();
const AttendanceStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const GUIDE_SEEN_KEY = 'flash-guide-seen-v1';

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Attendance: { active: 'timer', inactive: 'timer-outline' },
  Logs: { active: 'calendar', inactive: 'calendar-outline' },
  Salary: { active: 'cash', inactive: 'cash-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

const AttendanceStackScreen = () => {
  const theme = useAppTheme();

  return (
    <AttendanceStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.surface },
      }}
    >
      <AttendanceStack.Screen name="AttendanceMain" component={AttendanceScreen} />
      <AttendanceStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: true, title: 'Thong bao' }}
      />
    </AttendanceStack.Navigator>
  );
};

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
        options={{ headerShown: true, title: 'Giao dien' }}
      />
      <ProfileStack.Screen
        name="PersonalInfo"
        component={PersonalInfoScreen}
        options={{ headerShown: true, title: 'Thong tin ca nhan' }}
      />
      <ProfileStack.Screen
        name="Policy"
        component={PolicyScreen}
        options={{ headerShown: true, title: 'Chinh sach va quy dinh' }}
      />
      <ProfileStack.Screen
        name="UserGuide"
        component={UserGuideScreen}
        options={{ headerShown: true, title: 'Huong dan su dung' }}
      />
      <ProfileStack.Screen
        name="SupportFeedback"
        component={SupportFeedbackScreen}
        options={{ headerShown: true, title: 'Ho tro va gop y' }}
      />
    </ProfileStack.Navigator>
  );
};

const MainTabs = () => {
  const theme = useAppTheme();
  const mode = useThemeStore((s) => s.mode);
  const systemScheme = useColorScheme();
  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
  const tabBackground = isDark ? '#111317' : '#FFFFFF';

  return (
    <Tab.Navigator
      tabBar={(props) => (
        <View style={styles.tabOuter}>
          <View
            style={[
              styles.tabGlass,
              {
                backgroundColor: tabBackground,
                borderColor: theme.colors.outlineVariant,
                shadowColor: theme.colors.primary,
              },
            ]}
          >
            {props.state.routes.map((route, index) => {
              const focused = props.state.index === index;
              const iconConfig = TAB_ICONS[route.name] ?? TAB_ICONS.Attendance;
              const iconName = focused ? iconConfig.active : iconConfig.inactive;
              const color = focused ? theme.colors.primary : theme.colors.outline;
              const label = props.descriptors[route.key].options.title || route.name;

              return (
                <TouchableOpacity
                  key={route.key}
                  style={styles.tabItem}
                  onPress={() => props.navigation.navigate(route.name as never)}
                >
                  <View
                    style={[
                      styles.iconBubble,
                      focused && {
                        backgroundColor: theme.colors.primaryContainer,
                        borderColor: theme.colors.primary,
                      },
                    ]}
                  >
                    <Ionicons name={iconName} size={20} color={color} />
                  </View>
                  <Text style={[styles.tabLabel, { color }]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tab.Screen name="Attendance" component={AttendanceStackScreen} options={{ title: 'Diem danh' }} />
      <Tab.Screen name="Logs" component={LogsScreen} options={{ title: 'Lich su' }} />
      <Tab.Screen name="Salary" component={SalaryScreen} options={{ title: 'Bang luong' }} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} options={{ title: 'Ca nhan' }} />
    </Tab.Navigator>
  );
};

const AuthStackScreen = () => {
  const theme = useAppTheme();

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.onSurface,
        contentStyle: { backgroundColor: theme.colors.surface },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: 'Dang ky' }} />
    </AuthStack.Navigator>
  );
};

export default function AppNavigator() {
  const theme = useAppTheme();
  const mode = useThemeStore((s) => s.mode);
  const systemScheme = useColorScheme();
  const updateProfileStore = useProfileStore((s) => s.updateProfile);

  const [guideSeen, setGuideSeen] = useState<boolean | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useAutoFirebaseSync(user?.uid ?? null);

  useEffect(() => {
    AsyncStorage.getItem(GUIDE_SEEN_KEY).then((v) => {
      setGuideSeen(v === '1');
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      if (!authReady || user) return;
      const saved = await readAuthSession();
      if (!saved) return;

      try {
        await signInWithEmailAndPassword(auth, saved.email, saved.password);
      } catch (error) {
        console.warn('Restore login session failed', error);
      }
    };

    void restoreSession();
  }, [authReady, user]);

  useEffect(() => {
    const hydrate = async () => {
      if (!user) {
        return;
      }

      try {
        const remoteProfile = await fetchUserProfile(user.uid);
        if (remoteProfile) {
          updateProfileStore(remoteProfile);
        } else {
          updateProfileStore({
            fullName: user.displayName || 'Nguoi dung',
            email: user.email || '',
          });
        }
      } catch (error) {
        console.warn('Hydrate profile failed', error);
      }
    };

    void hydrate();
  }, [user, updateProfileStore]);

  const markGuideSeen = async () => {
    await AsyncStorage.setItem(GUIDE_SEEN_KEY, '1');
    setGuideSeen(true);
  };

  const resolvedDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
  const navTheme = resolvedDark ? DarkTheme : DefaultTheme;

  if (guideSeen === null || !authReady) {
    return null;
  }

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
        {!user ? (
          <RootStack.Screen name="Auth" component={AuthStackScreen} />
        ) : (
          <>
            {!guideSeen && (
              <RootStack.Screen name="FlashGuide">
                {() => <FlashGuideScreen onDone={markGuideSeen} />}
              </RootStack.Screen>
            )}
            <RootStack.Screen name="MainTabs" component={MainTabs} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabOuter: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
  },
  tabGlass: {
    flexDirection: 'row',
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 9,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  iconBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
