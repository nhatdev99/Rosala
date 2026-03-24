import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Nhắc nhở check-in',
    content: 'Đừng quên check-in ca sáng trước 08:00.',
    time: 'Hôm nay • 07:30',
  },
  {
    id: '2',
    title: 'Cập nhật bảng lương',
    content: 'Bảng lương tháng này đã được cập nhật.',
    time: 'Hôm qua • 16:20',
  },
  {
    id: '3',
    title: 'Thông báo hệ thống',
    content: 'Bạn có thể chọn giao diện mới trong phần Cài đặt Theme.',
    time: '2 ngày trước',
  },
];

export default function NotificationsScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Thông báo</Text>
      {MOCK_NOTIFICATIONS.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardTop}>
            <Ionicons name="notifications-outline" size={18} color={theme.colors.primary} />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
          <Text style={styles.cardContent}>{item.content}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    content: {
      padding: 16,
      gap: 12,
      paddingBottom: 24,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.onSurface,
    },
    card: {
      backgroundColor: theme.colors.surfaceContainerLow,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      padding: 12,
      gap: 6,
    },
    cardTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.onSurface,
    },
    cardContent: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 20,
    },
    time: {
      fontSize: 12,
      color: theme.colors.outline,
    },
  });
