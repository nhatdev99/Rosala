import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

export default function PolicyScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Chính sách & Quy định</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>1. Chấm công</Text>
        <Text style={styles.text}>- Mỗi ngày chỉ ghi nhận một bản ghi chấm công.</Text>
        <Text style={styles.text}>- Ngày hiện tại hỗ trợ Check In/Check Out theo thời gian thực.</Text>
        <Text style={styles.text}>- Ngày trước được phép ghi nhận nhanh theo số giờ cấu hình.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>2. Lương & Thuế</Text>
        <Text style={styles.text}>- Lương được tính theo hệ số của từng loại ca làm.</Text>
        <Text style={styles.text}>- Thuế là phần trăm khấu trừ trên tổng lương tháng.</Text>
        <Text style={styles.text}>- Người dùng có thể cập nhật cấu hình trong phần Cài đặt lương.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>3. Bảo mật dữ liệu</Text>
        <Text style={styles.text}>- Dữ liệu được lưu cục bộ trên thiết bị bằng bộ nhớ an toàn của ứng dụng.</Text>
        <Text style={styles.text}>- Không chia sẻ dữ liệu chấm công nếu chưa có sự đồng ý của người dùng.</Text>
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
    content: {
      padding: 16,
      gap: 12,
      paddingBottom: 30,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.onSurface,
      marginBottom: 4,
    },
    card: {
      backgroundColor: theme.colors.surfaceContainerLow,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      gap: 6,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.onSurface,
    },
    text: {
      fontSize: 14,
      lineHeight: 22,
      color: theme.colors.onSurfaceVariant,
    },
  });
