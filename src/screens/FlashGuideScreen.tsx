import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';

export default function FlashGuideScreen({ onDone }: { onDone: () => void }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Chào mừng đến với Rosala 👋</Text>
        <Text style={styles.subtitle}>Hướng dẫn nhanh để bắt đầu sử dụng ứng dụng:</Text>

        <GuideItem icon="finger-print-outline" text="Bấm Check In để bắt đầu ca hôm nay." />
        <GuideItem icon="time-outline" text="Với ngày trước, chỉ cần chọn ngày và ca để lưu số giờ theo cài đặt." />
        <GuideItem icon="calculator-outline" text="Thiết lập hệ số lương trong mục Cài đặt lương." />
        <GuideItem icon="color-palette-outline" text="Đổi giao diện trong mục Theme để cá nhân hoá trải nghiệm." />

        <TouchableOpacity style={styles.btn} onPress={onDone} activeOpacity={0.9}>
          <Text style={styles.btnText}>Bắt đầu ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function GuideItem({ icon, text }: { icon: any; text: string }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.itemRow}>
      <Ionicons name={icon} size={18} color={theme.colors.primary} />
      <Text style={styles.itemText}>{text}</Text>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      padding: 16,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      gap: 10,
    },
    title: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.colors.onSurface,
    },
    subtitle: {
      color: theme.colors.onSurfaceVariant,
      marginBottom: 4,
    },
    itemRow: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'flex-start',
    },
    itemText: {
      flex: 1,
      color: theme.colors.onSurface,
      lineHeight: 20,
    },
    btn: {
      marginTop: 10,
      height: 44,
      borderRadius: 10,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnText: {
      color: theme.colors.onPrimary,
      fontWeight: '700',
      fontSize: 15,
    },
  });
