import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { useAppTheme } from '../hooks/useAppTheme';
import { useNotificationStore } from '../store/useNotificationStore';

export default function NotificationsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const notifications = useNotificationStore((s) => s.notifications);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thông báo</Text>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markText}>Đánh dấu đã đọc</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có thông báo.</Text>}
        renderItem={({ item }) => (
          <View style={[styles.card, !item.read && styles.cardUnread]}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMessage}>{item.message}</Text>
            <Text style={styles.cardTime}>{format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}</Text>
          </View>
        )}
      />
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface, padding: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    title: { fontSize: 22, fontWeight: '700', color: theme.colors.onSurface },
    markText: { color: theme.colors.primary, fontWeight: '600' },
    empty: { color: theme.colors.onSurfaceVariant, marginTop: 20, textAlign: 'center' },
    card: {
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      borderRadius: 12,
      padding: 12,
      marginBottom: 10,
      backgroundColor: theme.colors.surfaceContainerLow,
      gap: 4,
    },
    cardUnread: { borderColor: theme.colors.primary },
    cardTitle: { color: theme.colors.onSurface, fontWeight: '700' },
    cardMessage: { color: theme.colors.onSurfaceVariant, lineHeight: 20 },
    cardTime: { color: theme.colors.outline, fontSize: 12, marginTop: 4 },
  });
