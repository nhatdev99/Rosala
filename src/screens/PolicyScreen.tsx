import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

export default function PolicyScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>
        Kế hoạch ứng dụng tính lương, chấm công
      </Text>

      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>
          1. Điều khoản Sử dụng (Terms of Service)
        </Text>

        <Text style={styles.subTitle}>Mục đích sử dụng</Text>
        <Text style={styles.bullet}>• Ứng dụng là công cụ hỗ trợ cá nhân để theo dõi thời gian làm việc và ước tính thu nhập.</Text>
        <Text style={styles.bullet}>
          • Kết quả tính toán chỉ mang tính chất tham khảo. Ứng dụng không thay thế cho hệ thống kế toán,
          bảng lương chính thức của cơ quan hay tổ chức pháp định nào.
        </Text>

        <Text style={styles.subTitle}>Trách nhiệm của người dùng</Text>
        <Text style={styles.bullet}>
          • Người dùng chịu trách nhiệm hoàn toàn về tính chính xác của các thông số nhập vào
          (lương cơ bản, hệ số, giờ làm).
        </Text>
        <Text style={styles.bullet}>
          • Người dùng có trách nhiệm tự bảo mật thiết bị cá nhân để tránh lộ thông tin thu nhập.
        </Text>

        <Text style={styles.subTitle}>Giới hạn trách nhiệm</Text>
        <Text style={styles.bullet}>
          • Chúng tôi (Nhà phát triển) không chịu trách nhiệm cho bất kỳ tổn thất tài chính,
          sai sót trong việc nhận lương thực tế, hoặc tranh chấp lao động nào phát sinh từ việc
          sử dụng số liệu trong ứng dụng.
        </Text>
        <Text style={styles.bullet}>
          • Chúng tôi không chịu trách nhiệm nếu dữ liệu bị mất do người dùng xóa ứng dụng,
          hỏng thiết bị hoặc lỗi hệ điều hành mà không có bản sao lưu.
        </Text>
      </View>

      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>2. Chính sách Bảo mật (Privacy Policy)</Text>

        <Text style={styles.subTitle}>Thu thập dữ liệu</Text>
        <Text style={styles.bullet}>
          • Dữ liệu cục bộ: Ứng dụng lưu trữ toàn bộ thông tin (mức lương, lịch sử chấm công)
          trực tiếp trên bộ nhớ thiết bị của bạn thông qua Async Storage.
        </Text>
        <Text style={styles.bullet}>
          • Dữ liệu máy chủ: Chúng tôi không thu thập, không lưu trữ và không truyền tải bất kỳ
          dữ liệu cá nhân nào của bạn về máy chủ bên ngoài.
        </Text>

        <Text style={styles.subTitle}>Quyền hạn (Permissions)</Text>
        <Text style={styles.bullet}>• Bộ nhớ (Storage): Để lưu trữ cài đặt và log chấm công.</Text>
        <Text style={styles.bullet}>• Thông báo (Notifications): Để nhắc nhở chấm công (nếu người dùng bật).</Text>
        <Text style={styles.bullet}>
          • Vị trí (GPS): (Nếu bạn có làm tính năng widget chấm công tại công ty) - Chỉ dùng để xác thực
          vị trí tại thời điểm chấm công và không được chia sẻ cho bên thứ ba.
        </Text>

        <Text style={styles.subTitle}>Bảo mật dữ liệu</Text>
        <Text style={styles.bullet}>
          • Vì dữ liệu nằm trên máy bạn, quyền truy cập dữ liệu phụ thuộc vào bảo mật của điện thoại
          (mật mã, vân tay). Chúng tôi khuyến nghị người dùng không bẻ khóa (jailbreak/root)
          thiết bị để đảm bảo an toàn thông tin.
        </Text>
      </View>

      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>
          3. Tuyên bố miễn trừ trách nhiệm (Disclaimer)
        </Text>
        <Text style={styles.quote}>
          "Bằng việc sử dụng ứng dụng này, bạn mặc nhiên chấp nhận rằng kết quả tính toán có thể có sai số
          so với thực tế do các quy định về thuế, bảo hiểm xã hội hoặc các khoản giảm trừ khác mà ứng dụng
          chưa cập nhật. Mọi quyết định tài chính dựa trên số liệu của ứng dụng là rủi ro riêng của người dùng."
        </Text>
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
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 30,
      gap: 16,
    },
    pageTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.onSurface,
      marginBottom: 6,
    },
    sectionBlock: {
      backgroundColor: theme.colors.surfaceContainerLow,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      padding: 14,
      gap: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.colors.onSurface,
      marginBottom: 4,
    },
    subTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.onSurface,
      marginTop: 8,
    },
    bullet: {
      fontSize: 16,
      lineHeight: 30,
      color: theme.colors.onSurfaceVariant,
    },
    quote: {
      fontSize: 16,
      lineHeight: 30,
      color: theme.colors.onSurface,
      fontStyle: 'italic',
    },
  });
