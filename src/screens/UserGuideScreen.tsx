import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';

const guideSections = [
  {
    title: 'Bước 1: Cài đặt hệ số lương (NÊN LÀM ĐẦU TIÊN)',
    items: [
      'Vào Hồ sơ → Cài đặt hệ số lương.',
      'Chọn từng loại ca: Ca ngày, Ca đêm, Nghỉ ngày, Nghỉ đêm.',
      'Nhập đầy đủ: giờ cơ bản, giờ tăng ca, đơn giá cơ bản, đơn giá tăng ca.',
      'Với ca đêm và nghỉ đêm, nhập thêm giờ phụ, đơn giá giờ phụ và phụ cấp.',
      'Bạn có thể nhập số thập phân bằng dấu "," hoặc "." (ví dụ: 2,5 hoặc 2.5 đều hợp lệ).',
      'Quan sát khung “Xem trước lương 1 ca” để kiểm tra kết quả trước khi lưu.',
      'Bấm “Lưu thay đổi” để áp dụng cấu hình mới.',
    ],
  },
  {
    title: 'Bước 2: Chấm công hằng ngày',
    items: [
      'Vào tab Điểm danh để check-in/check-out theo thời gian thực cho ngày hiện tại.',
      'Nếu check-in hôm nay: hệ thống ghi nhận giờ vào, check-out sẽ tự tính giờ thực tế.',
      'Nếu thêm công cho ngày trước: chọn ngày và loại ca, app sẽ tự điền giờ theo cấu hình.',
      'Mỗi ngày chỉ nên có 1 bản ghi để tránh trùng dữ liệu.',
    ],
  },
  {
    title: 'Bước 3: Quản lý lịch sử chấm công',
    items: [
      'Vào tab Lịch sử để xem dữ liệu theo tháng và theo ngày.',
      'Có thể chọn nhanh một ngày trên lịch để check-in nhanh (dùng cùng logic như màn Điểm danh).',
      'Kiểm tra lại giờ vào/ra và loại ca trước khi chốt lương.',
      'Bạn có thể xoá bản ghi sai và nhập lại.',
    ],
  },
  {
    title: 'Bước 4: Kiểm tra bảng lương',
    items: [
      'Vào tab Bảng lương để xem tổng lương theo tháng.',
      'Hệ thống tự cộng: lương cơ bản + tăng ca + giờ phụ + phụ cấp (nếu có).',
      'Nếu doanh nghiệp có thuế/khấu trừ, hãy cấu hình đúng để số liệu sát thực tế.',
      'Luôn đối chiếu với bảng lương chính thức của công ty trước khi quyết toán.',
    ],
  },
  {
    title: 'Các chức năng có sẵn trong ứng dụng',
    items: [
      'Đăng nhập/đăng ký và tự động lưu phiên đăng nhập.',
      'Cài đặt giao diện (light/dark/system + bảng màu pastel).',
      'Quản lý thông tin cá nhân, mã nhân viên, ảnh đại diện.',
      'Xem chính sách & pháp lý ngay trong ứng dụng.',
      'Hướng dẫn nhanh lúc mở app lần đầu và hướng dẫn chi tiết trong phần Cài đặt.',
    ],
  },
];

export default function UserGuideScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Hướng dẫn sử dụng chi tiết</Text>
      <Text style={styles.subtitle}>
        Tài liệu này giúp bạn thiết lập đúng ngay từ đầu để dữ liệu chấm công và lương chính xác,
        dễ theo dõi, dễ đối chiếu.
      </Text>

      {guideSections.map((section, idx) => (
        <View key={section.title} style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconWrap}>
              <Ionicons name="book-outline" size={16} color={theme.colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>

          {section.items.map((item, itemIdx) => (
            <View key={`${idx}-${itemIdx}`} style={styles.itemRow}>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
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
      paddingBottom: 28,
    },
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.colors.onSurface,
    },
    subtitle: {
      color: theme.colors.onSurfaceVariant,
      lineHeight: 22,
      marginBottom: 2,
      fontSize: 14,
    },
    card: {
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      borderRadius: 12,
      padding: 14,
      gap: 8,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
    },
    iconWrap: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primaryContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: '800',
      color: theme.colors.onSurface,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
    },
    dot: {
      color: theme.colors.primary,
      marginTop: 1,
      fontSize: 14,
    },
    itemText: {
      flex: 1,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 24,
      fontSize: 14,
    },
  });
