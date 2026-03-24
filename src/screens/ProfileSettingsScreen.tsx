import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { useAuthStore, useCurrentUser } from '../store/useAuthStore';
import { useNotificationStore } from '../store/useNotificationStore';

const AVATARS = ['avatar_1', 'avatar_2', 'avatar_3', 'avatar_4'];

export default function ProfileSettingsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const user = useCurrentUser();
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const updateAvatar = useAuthStore((s) => s.updateAvatar);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [role, setRole] = useState(user?.role || 'Nhân viên');
  const [phone, setPhone] = useState(user?.phone || '');

  if (!user) return null;

  const save = () => {
    updateProfile({ fullName, role, phone });
    addNotification({
      type: 'profile',
      title: 'Cập nhật hồ sơ',
      message: 'Thông tin cá nhân đã được lưu (offline).',
    });
    Alert.alert('Đã lưu', 'Thông tin cá nhân đã được cập nhật.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin cá nhân</Text>
      <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Họ tên" />
      <TextInput style={styles.input} value={role} onChangeText={setRole} placeholder="Vai trò" />
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Số điện thoại" />

      <Text style={styles.sectionTitle}>Ảnh đại diện (offline)</Text>
      <View style={styles.avatarRow}>
        {AVATARS.map((a) => (
          <TouchableOpacity
            key={a}
            style={[styles.avatar, user.avatarId === a && styles.avatarActive]}
            onPress={() => updateAvatar(a)}
          >
            <Text style={styles.avatarText}>{a.slice(-1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={save}>
        <Text style={styles.saveText}>Lưu thay đổi</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface, padding: 16 },
    title: { fontSize: 22, fontWeight: '700', color: theme.colors.onSurface, marginBottom: 12 },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      borderRadius: 10,
      marginBottom: 10,
      height: 44,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.surfaceContainerLow,
      color: theme.colors.onSurface,
    },
    sectionTitle: { marginTop: 6, marginBottom: 8, color: theme.colors.onSurface, fontWeight: '700' },
    avatarRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
    avatar: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      backgroundColor: theme.colors.secondaryContainer,
    },
    avatarActive: { borderColor: theme.colors.primary, borderWidth: 2 },
    avatarText: { color: theme.colors.onSurface, fontWeight: '700' },
    saveBtn: {
      marginTop: 8,
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveText: { color: theme.colors.onPrimary, fontWeight: '700' },
  });
