import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from '../hooks/useAppTheme';
import { auth } from '../services/firebase';
import { syncAsyncStorageToFirebase } from '../services/asyncStorageFirebaseSync';

const LAST_BACKUP_KEY = 'last-manual-backup-at';

export default function BackupScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastBackupAt, setLastBackupAt] = useState<string | null>(null);

  React.useEffect(() => {
    AsyncStorage.getItem(LAST_BACKUP_KEY).then(setLastBackupAt);
  }, []);

  const handleBackupNow = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      Alert.alert('Thong bao', 'Vui long dang nhap de sao luu len Firebase.');
      return;
    }

    setIsSyncing(true);
    try {
      const result = await syncAsyncStorageToFirebase(uid, { force: true });
      const nowISO = new Date().toISOString();
      await AsyncStorage.setItem(LAST_BACKUP_KEY, nowISO);
      setLastBackupAt(nowISO);
      Alert.alert(
        'Sao luu thanh cong',
        result.skipped ? 'Du lieu da dong bo truoc do.' : 'Du lieu da duoc sao luu len Firebase.'
      );
    } catch (error: any) {
      Alert.alert('Sao luu that bai', error?.message || 'Khong the dong bo len Firebase.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name="cloud-upload-outline" size={32} color={theme.colors.primary} />
        </View>
        <Text style={styles.title}>Sao luu du lieu</Text>
        <Text style={styles.subtitle}>
          Luu toan bo du lieu cham cong, cai dat luong va thong tin ca nhan len Firebase.
        </Text>

        <TouchableOpacity
          style={[styles.backupBtn, isSyncing && styles.backupBtnDisabled]}
          onPress={handleBackupNow}
          disabled={isSyncing}
        >
          <Ionicons name={isSyncing ? 'sync' : 'cloud-upload'} size={18} color={theme.colors.onPrimary} />
          <Text style={styles.backupBtnText}>{isSyncing ? 'Dang sao luu...' : 'Sao luu ngay'}</Text>
        </TouchableOpacity>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Lan sao luu gan nhat</Text>
          <Text style={styles.metaValue}>
            {lastBackupAt ? new Date(lastBackupAt).toLocaleString('vi-VN') : 'Chua co'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    contentContainer: {
      padding: 20,
    },
    card: {
      backgroundColor: theme.colors.surfaceContainerLow,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      padding: 20,
      gap: 14,
    },
    iconWrap: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primaryContainer,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.onSurface,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.onSurfaceVariant,
    },
    backupBtn: {
      marginTop: 8,
      height: 46,
      borderRadius: 14,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    backupBtnDisabled: {
      opacity: 0.65,
    },
    backupBtnText: {
      color: theme.colors.onPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    metaRow: {
      marginTop: 6,
      borderTopWidth: 1,
      borderColor: theme.colors.outlineVariant,
      paddingTop: 12,
      gap: 4,
    },
    metaLabel: {
      fontSize: 12,
      color: theme.colors.outline,
      textTransform: 'uppercase',
    },
    metaValue: {
      fontSize: 14,
      color: theme.colors.onSurface,
      fontWeight: '600',
    },
  });
