import React, { useMemo } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, isAfter, parseISO, subDays } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { clearAuthSession } from '../services/authSession';
import { useAppTheme } from '../hooks/useAppTheme';
import { useSalaryStore } from '../store/useSalaryStore';
import { useProfileStore } from '../store/useProfileStore';

export default function ProfileScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const navigation = useNavigation<any>();
  const attendance = useSalaryStore((s) => s.attendance);
  const profile = useProfileStore((s) => s.profile);

  const weekHours = useMemo(() => {
    const cutoff = subDays(new Date(), 7);
    return attendance
      .filter((r) => isAfter(parseISO(r.date), cutoff))
      .reduce((sum, r) => sum + r.actualHours + r.overtimeHours, 0);
  }, [attendance]);

  const monthStr = format(new Date(), 'yyyy-MM');
  const monthShifts = useMemo(
    () => attendance.filter((r) => r.date.startsWith(monthStr)).length,
    [attendance, monthStr]
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await clearAuthSession();
    } catch (error: any) {
      Alert.alert('Thong bao', error?.message || 'Khong the dang xuat.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerBackground} />

      <View style={styles.profileSection}>
        <View style={styles.avatarWrapper}>
          {profile.avatarUri ? (
            <Image source={{ uri: profile.avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={48} color={theme.colors.outline} />
            </View>
          )}
          <TouchableOpacity style={styles.editAvatarBtn} onPress={() => navigation.navigate('PersonalInfo')}>
            <Ionicons name="pencil" size={16} color={theme.colors.onPrimary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{profile.fullName || 'Nguoi dung'}</Text>
        <Text style={styles.userRole}>{profile.employeeCode || 'Nhan vien'}</Text>
      </View>

      <View style={styles.mainCanvas}>
        <View style={styles.quickStatsGrid}>
          <View style={styles.statBox}>
            <View style={styles.statIconContainer}>
              <Ionicons name="time" size={24} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={styles.statLabel}>Gio lam 7 ngay</Text>
              <Text style={styles.statValue}>{weekHours.toFixed(1)}h</Text>
            </View>
          </View>

          <View style={styles.statBox}>
            <View
              style={[
                styles.statIconContainer,
                {
                  backgroundColor: theme.colors.tertiaryContainer,
                },
              ]}
            >
              <Ionicons name="calendar" size={24} color={theme.colors.tertiary} />
            </View>
            <View>
              <Text style={styles.statLabel}>So ca thang nay</Text>
              <Text style={styles.statValue}>{monthShifts}</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Cai dat luong</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="calculator-outline"
              title="Cai dat he so luong"
              theme={theme}
              styles={styles}
              onPress={() => navigation.navigate('SalaryConfig')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="color-palette-outline"
              title="Cai dat giao dien"
              theme={theme}
              styles={styles}
              onPress={() => navigation.navigate('ThemeSettings')}
            />
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Tai khoan</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="person-outline"
              title="Thong tin ca nhan"
              theme={theme}
              styles={styles}
              onPress={() => navigation.navigate('PersonalInfo')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="notifications-outline"
              title="Cai dat thong bao"
              theme={theme}
              styles={styles}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="cloud-upload-outline"
              title="Sao luu du lieu"
              theme={theme}
              styles={styles}
              onPress={() => navigation.navigate('Backup')}
            />
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Cong ty</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="document-text-outline"
              title="Chinh sach va quy dinh"
              theme={theme}
              styles={styles}
              onPress={() => navigation.navigate('Policy')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="help-circle-outline"
              title="Ho tro va gop y"
              theme={theme}
              styles={styles}
              onPress={() => navigation.navigate('SupportFeedback')}
            />
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Phan tich</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="stats-chart-outline"
              title="Thong ke va so sanh"
              theme={theme}
              styles={styles}
              onPress={() => navigation.navigate('StatisticsCompare')}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>Dang xuat</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Phien ban 1.0.0 (Build 2)</Text>
      </View>
    </ScrollView>
  );
}

const MenuItem = ({ icon, title, theme, styles, onPress }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={20} color={theme.colors.onSurfaceVariant} />
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={theme.colors.outline} />
  </TouchableOpacity>
);

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    contentContainer: {
      paddingBottom: 120,
    },
    headerBackground: {
      height: 180,
      backgroundColor: theme.colors.primary,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    profileSection: {
      alignItems: 'center',
      marginTop: 100,
      paddingHorizontal: 24,
    },
    avatarWrapper: {
      position: 'relative',
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    avatarPlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: theme.colors.surface,
      backgroundColor: theme.colors.surfaceContainerHigh,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: theme.colors.surface,
    },
    editAvatarBtn: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: theme.colors.surface,
      elevation: 4,
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: theme.typography.headline,
      color: theme.colors.onSurface,
      marginBottom: 4,
    },
    userRole: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.onSurfaceVariant,
    },
    mainCanvas: {
      paddingHorizontal: 24,
      marginTop: 32,
    },
    quickStatsGrid: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 32,
    },
    statBox: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceContainerLowest,
      padding: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.05)',
    },
    statIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: theme.colors.primaryContainer,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.outline,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
    },
    menuSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: 12,
      marginLeft: 8,
    },
    menuCard: {
      backgroundColor: theme.colors.surfaceContainerLowest,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.05)',
      overflow: 'hidden',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: theme.colors.surfaceContainerLow,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.onSurface,
    },
    divider: {
      height: 1,
      backgroundColor: 'rgba(0,0,0,0.05)',
      marginLeft: 64,
    },
    logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.errorContainer,
      padding: 16,
      borderRadius: 20,
      marginTop: 8,
      marginBottom: 24,
      gap: 8,
    },
    logoutText: {
      color: theme.colors.error,
      fontSize: 16,
      fontWeight: 'bold',
    },
    versionText: {
      textAlign: 'center',
      fontSize: 12,
      color: theme.colors.outline,
      marginBottom: 16,
    },
  });
