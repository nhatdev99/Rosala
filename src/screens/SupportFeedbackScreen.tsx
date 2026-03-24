import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';

export default function SupportFeedbackScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Hỗ trợ & Góp ý</Text>
      <Text style={styles.subtitle}>Liên hệ đội ngũ để được hỗ trợ nhanh nhất.</Text>

      <View style={styles.card}>
        <Row icon="mail-outline" title="Email hỗ trợ" value="support@rosala.app" />
        <Row icon="call-outline" title="Hotline" value="1900 1234" />
        <Row icon="chatbubble-ellipses-outline" title="Zalo" value="Rosala Support" />
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteTitle}>Gửi góp ý</Text>
        <Text style={styles.noteText}>Bạn có thể gửi ý kiến và đề xuất tính năng mới qua email với tiêu đề: [Góp ý Rosala].</Text>
      </View>

      <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
        <Ionicons name="send-outline" size={18} color={theme.colors.onPrimary} />
        <Text style={styles.actionText}>Gửi phản hồi</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Row({ icon, title, value }: { icon: any; title: string; value: string }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={18} color={theme.colors.primary} />
        <Text style={styles.rowTitle}>{title}</Text>
      </View>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface },
    content: { padding: 16, gap: 12, paddingBottom: 30 },
    title: { fontSize: 22, fontWeight: '700', color: theme.colors.onSurface },
    subtitle: { fontSize: 14, color: theme.colors.onSurfaceVariant, marginBottom: 4 },
    card: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      backgroundColor: theme.colors.surfaceContainerLow,
      paddingVertical: 6,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    rowTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.onSurface },
    rowValue: { fontSize: 13, color: theme.colors.onSurfaceVariant },
    noteBox: {
      backgroundColor: theme.colors.tertiaryContainer,
      borderRadius: 12,
      padding: 12,
      gap: 6,
    },
    noteTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.onSurface },
    noteText: { fontSize: 13, lineHeight: 20, color: theme.colors.onSurfaceVariant },
    actionBtn: {
      marginTop: 8,
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: 44,
    },
    actionText: {
      color: theme.colors.onPrimary,
      fontWeight: '700',
      fontSize: 14,
    },
  });
