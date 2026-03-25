import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

export default function PolicyScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Chính sách & Pháp lý</Text>
      <Text style={styles.subtitle}>
        Vui lòng đọc kỹ các điều khoản bên dưới trước khi sử dụng ứng dụng. Khi tiếp tục sử dụng,
        bạn được hiểu là đã đồng ý với toàn bộ nội dung.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>1. Điều khoản sử dụng (Terms of Service)</Text>

        <Text style={styles.blockTitle}>Mục đích sử dụng</Text>
        <Text style={styles.text}>• Ứng dụng là công cụ hỗ trợ cá nhân để theo dõi chấm công và ước tính thu nhập.</Text>
        <Text style={styles.text}>• Kết quả tính toán mang tính tham khảo, không thay thế bảng lương/kế toán chính thức.</Text>

        <Text style={styles.blockTitle}>Trách nhiệm người dùng</Text>
        <Text style={styles.text}>• Người dùng chịu trách nhiệm về độ chính xác của dữ liệu nhập (hệ số, giờ làm, ca làm, phụ cấp).</Text>
        <Text style={styles.text}>• Người dùng cần bảo mật thiết bị cá nhân và tài khoản để tránh lộ dữ liệu thu nhập.</Text>

        <Text style={styles.blockTitle}>Giới hạn trách nhiệm</Text>
        <Text style={styles.text}>• Nhà phát triển không chịu trách nhiệm cho các tổn thất tài chính phát sinh do dữ liệu nhập sai hoặc thay đổi chính sách lương thực tế.</Text>
        <Text style={styles.text}>• Chúng tôi không chịu trách nhiệm nếu dữ liệu mất do xoá app, hỏng thiết bị, hoặc lỗi hệ điều hành không có sao lưu.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>2. Chính sách Bảo mật (Privacy Policy)</Text>

        <Text style={styles.blockTitle}>Thu thập dữ liệu</Text>
        <Text style={styles.text}>• Dữ liệu cục bộ: thông tin chấm công, cấu hình lương, phụ cấp, cài đặt giao diện được lưu trên thiết bị qua AsyncStorage.</Text>
        <Text style={styles.text}>• Dữ liệu tài khoản: email và hồ sơ cơ bản có thể đồng bộ qua Firebase khi bạn đăng nhập.</Text>

        <Text style={styles.blockTitle}>Quyền hạn ứng dụng</Text>
        <Text style={styles.text}>• Bộ nhớ: dùng để lưu cấu hình và lịch sử chấm công.</Text>
        <Text style={styles.text}>• Thông báo (nếu bật): dùng để nhắc check-in/check-out.</Text>
        <Text style={styles.text}>• Ảnh đại diện (nếu dùng): chỉ để cá nhân hóa hồ sơ người dùng.</Text>

        <Text style={styles.blockTitle}>Bảo mật dữ liệu</Text>
        <Text style={styles.text}>• Dữ liệu phụ thuộc mức độ bảo mật thiết bị của bạn (mật khẩu, vân tay, Face ID).</Text>
        <Text style={styles.text}>• Chúng tôi khuyến nghị không bẻ khoá (root/jailbreak) thiết bị để giảm rủi ro rò rỉ dữ liệu.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>3. Tuyên bố miễn trừ trách nhiệm (Disclaimer)</Text>
        <Text style={styles.text}>• Mọi phép tính lương trong ứng dụng có thể sai lệch so với thực tế do chính sách thuế, bảo hiểm hoặc quy định nội bộ doanh nghiệp.</Text>
        <Text style={styles.text}>• Người dùng cần đối chiếu với bảng lương chính thức trước khi đưa ra quyết định tài chính.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>4. Cập nhật chính sách</Text>
        <Text style={styles.text}>• Nội dung chính sách có thể được điều chỉnh để phù hợp với phiên bản ứng dụng mới.</Text>
        <Text style={styles.text}>• Việc tiếp tục sử dụng sau khi cập nhật đồng nghĩa bạn chấp nhận nội dung mới.</Text>
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
      fontSize: 24,
      fontWeight: '800',
      color: theme.colors.onSurface,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 22,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 6,
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
      fontSize: 19,
      fontWeight: '800',
      color: theme.colors.onSurface,
      marginBottom: 4,
    },
    blockTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.onSurface,
      marginTop: 6,
      marginBottom: 2,
    },
    text: {
      fontSize: 15,
      lineHeight: 25,
      color: theme.colors.onSurfaceVariant,
    },
  });
